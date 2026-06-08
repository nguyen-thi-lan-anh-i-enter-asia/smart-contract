import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Telegraf, Markup } from 'telegraf';
import { EnergyPackage } from '../entities/energy-package.entity';
import { PlatformWallet } from '../entities/platform-wallet.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  // Thêm dấu ! để xử lý triệt để lỗi "no initializer" của TypeScript strict mode
  private bot!: Telegraf;
  // Biến tạm để lưu trạng thái chờ nhập dữ liệu của Admin
  private sessionState: {
    [chatId: number]: { action: string; targetId?: string };
  } = {};

  constructor(
    @InjectRepository(EnergyPackage)
    private readonly packageRepo: Repository<EnergyPackage>,
    @InjectRepository(PlatformWallet)
    private readonly walletRepo: Repository<PlatformWallet>,
  ) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      this.bot = new Telegraf(token);
    }
  }

  onModuleInit() {
    if (!this.bot) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN chưa được cấu hình ở .env');
      return;
    }

    this.registerEvents();
    this.bot.launch().then(() => {
      console.log(
        '🤖 Telegram Management Bot (Nút bấm) đã kích hoạt thành công!',
      );
    });
  }

  private registerEvents() {
    // Menu chính khi gõ /start hoặc /menu
    const sendMainMenu = (ctx: any) => {
      ctx.reply(
        '⚙️ **BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN**\nVui lòng chọn một tác vụ dưới đây:',
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback('📋 Xem Danh Sách Gói & Ví', 'menu_list')],
            [
              Markup.button.callback(
                '💰 Sửa Giá Gói Năng Lượng',
                'menu_edit_price',
              ),
            ],
            // [Markup.button.callback('💳 Thay Đổi Địa Chỉ Ví QR', 'menu_edit_wallet')]
          ]),
        },
      );
    };

    this.bot.start(sendMainMenu);
    this.bot.command('menu', sendMainMenu);

    // 1. Xử lý nút: Xem danh sách
    this.bot.action('menu_list', async (ctx) => {
      await ctx.answerCbQuery();
      const packages = await this.packageRepo.find({
        order: { displayOrder: 'ASC' },
      });
      const wallet = await this.walletRepo.findOne({ where: { id: 1 } });

      let msg = `⚡ **DANH SÁCH GÓI HIỆN TẠI:**\n\n`;
      packages.forEach((p, idx) => {
        msg += `🔹 *STT ${idx + 1}:* ${parseInt(p.energyAmount).toLocaleString()} NL ➔ *${p.priceInTrx} TRX* (${p.durationHours}h)\n`;
      });

      if (wallet) {
        msg += `\n💳 **Ví Nhận Tiền QR Hiện Tại:**\n\`${wallet.qrAddress}\``;
      } else {
        msg += `\n⚠️ Chưa có ví nào được cấu hình trong DB.`;
      }

      // Gửi kèm nút quay lại menu chính
      ctx.reply(msg, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.callback('⬅️ Quay Lại Menu', 'go_to_menu')],
        ]),
      });
    });

    // 2. Xử lý nút: Sửa giá gói (Hiển thị danh sách các gói dưới dạng nút bấm)
    this.bot.action('menu_edit_price', async (ctx) => {
      await ctx.answerCbQuery();
      const packages = await this.packageRepo.find({
        order: { displayOrder: 'ASC' },
      });

      if (packages.length === 0) {
        return ctx.reply('Hệ thống hiện chưa có gói nào.');
      }

      const buttons = packages.map((p) => [
        Markup.button.callback(
          `⚡ Gói ${parseInt(p.energyAmount).toLocaleString()} NL (${p.priceInTrx} TRX)`,
          `select_pkg_${p.id}`,
        ),
      ]);
      buttons.push([Markup.button.callback('⬅️ Quay Lại', 'go_to_menu')]);

      ctx.reply(
        'Chọn gói năng lượng bạn muốn thay đổi giá:',
        Markup.inlineKeyboard(buttons),
      );
    });

    // Xử lý khi chọn một gói cụ thể để sửa giá
    this.bot.action(/^select_pkg_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const pkgId = ctx.match[1];
      const pkg = await this.packageRepo.findOne({ where: { id: pkgId } });

      if (!pkg) return ctx.reply('Gói không tồn tại hoặc đã bị xóa.');

      const chatId = ctx.chat?.id;
      if (chatId) {

        // Lưu lại trạng thái chờ nhập giá tiền cho chính ID gói này
        this.sessionState[chatId] = { action: 'INPUT_PRICE', targetId: pkgId };

        // 🌟 HIỂN THỊ TIN NHẮN YÊU CẦU NGƯỜI DÙNG NHẬP GIÁ 🌟
        ctx.reply(
          `📝 **YÊU CẦU NHẬP GIÁ MỚI**\n\n` +
          `• Gói đã chọn: *${parseInt(pkg.energyAmount).toLocaleString()} Năng Lượng*\n` +
          `• Giá hiện tại: *${pkg.priceInTrx} TRX*\n\n` +
          `👉 Hãy gõ **số tiền TRX mới** mong muốn và ấn gửi tin nhắn lên đây:`,
          { parse_mode: 'Markdown' }
        );
      }
    });

    // 3. Xử lý nút: Sửa địa chỉ ví QR
    // this.bot.action('menu_edit_wallet', async (ctx) => {
    //   await ctx.answerCbQuery();
    //   const chatId = ctx.chat?.id;
    //   if (chatId) {
    //     this.sessionState[chatId] = { action: 'INPUT_WALLET' };
    //     ctx.reply('✍️ Vui lòng gửi *Địa chỉ ví TRON mới* dùng để nhận tiền và tạo mã QR:', { parse_mode: 'Markdown' });
    //   }
    // });

    // Xử lý nút quay lại Menu chính
    this.bot.action('go_to_menu', async (ctx) => {
      await ctx.answerCbQuery();
      sendMainMenu(ctx);
    });

    // Lắng nghe tin nhắn văn bản do Admin nhập vào (Giá tiền mới hoặc Địa chỉ ví mới)
    this.bot.on('text', async (ctx) => {
      const chatId = ctx.chat.id;
      const state = this.sessionState[chatId];

      if (!state) {
        // Nếu không ở trong trạng thái chờ nhập dữ liệu, gợi ý mở menu
        return ctx.reply(
          'Vui lòng gõ /menu hoặc bấm /start để mở bảng điều khiển nút bấm.',
        );
      }

      const userInput = ctx.message.text.trim();

      // Trường hợp 1: Admin nhập giá tiền mới
      if (state.action === 'INPUT_PRICE' && state.targetId) {
        const newPrice = parseFloat(userInput);
        if (isNaN(newPrice) || newPrice < 0) {
          return ctx.reply(
            '❌ Giá tiền không hợp lệ! Vui lòng nhập lại một số dương (Ví dụ: 12.5):',
          );
        }

        const pkg = await this.packageRepo.findOne({
          where: { id: state.targetId },
        });
        if (pkg) {
          pkg.priceInTrx = newPrice;
          await this.packageRepo.save(pkg);
          ctx.reply(
            `✅ Cập nhật thành công! Gói *${parseInt(pkg.energyAmount).toLocaleString()} NL* đã đổi sang giá mới là *${newPrice} TRX*.`,
            { parse_mode: 'Markdown' },
          );
        } else {
          ctx.reply('❌ Có lỗi xảy ra, không tìm thấy gói.');
        }

        delete this.sessionState[chatId]; // Xóa trạng thái chờ
        return sendMainMenu(ctx); // Trả về menu chính
      }

      // Trường hợp 2: Admin nhập ví mới
      //   if (state.action === 'INPUT_WALLET') {
      //     if (userInput.length < 34 || !userInput.startsWith('T')) {
      //       return ctx.reply('❌ Địa chỉ ví TRON không đúng định dạng (Phải bắt đầu bằng chữ T và đủ ký tự). Vui lòng nhập lại:');
      //     }

      //     let wallet = await this.walletRepo.findOne({ where: { id: 1 } });
      //     if (!wallet) {
      //       wallet = this.walletRepo.create({ id: 1, tronlinkAddress: userInput, qrAddress: userInput });
      //     } else {
      //       wallet.qrAddress = userInput;
      //       wallet.tronlinkAddress = userInput; // Đồng bộ cả 2 trường địa chỉ
      //     }

      //     await this.walletRepo.save(wallet);
      //     ctx.reply(`✅ Thay đổi ví QR thành công!\nĐịa chỉ mới:\n\`${userInput}\``, { parse_mode: 'Markdown' });

      //     delete this.sessionState[chatId]; // Xóa trạng thái chờ
      //     return sendMainMenu(ctx); // Trả về menu chính
      //   }
    });
  }
}
