<template>
  <div class="max-w-2xl mx-auto px-4">
    <div class="text-center mb-5">
      <h1 class="text-2xl font-bold text-white mb-1">TRON Energy Rental</h1>
      <p class="text-xs text-gray-400">Maximize Energy. Minimize Cost.</p>
    </div>

    <div
      class="bg-gray-900/80 backdrop-blur-xl rounded-lg overflow-hidden">
      <div class="p-4 border-b border-white/5">
        <div class="flex gap-2">
          <button @click="paymentMethod = 'qr'"
            :class="paymentMethod === 'qr' ? 'bg-amber-500 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'"
            class="flex-1 px-2 sm:px-4 py-3 rounded-lg font-medium text-sm transition-all">
            <div class="flex items-center justify-center gap-2">
              <img src="../assets/image/qr-code.svg" alt="QR Code" class="brightness-0 invert" width="16" height="16"
                style="color:transparent" />
              <span class="text-xs sm:text-sm">QR Code</span>
            </div>
          </button>
          <button @click="paymentMethod = 'tronlink'"
            :class="paymentMethod === 'tronlink' ? 'bg-amber-500 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/30'"
            class="flex-1 px-4 py-3 rounded-2xl font-medium text-sm transition-all">
            <div class="flex items-center justify-center gap-2">
              <img src="../assets/image/tron-link.svg" alt="TronLink" class="brightness-0 invert" width="16" height="16"
                style="color:transparent" />
              <span class="text-xs sm:text-sm">TronLink</span>
            </div>
          </button>
        </div>
      </div>

      <div class="p-5 space-y-6">
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Select Package</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="pkg in packages" :key="pkg.id" @click="selectedPackage = pkg"
              :class="selectedPackage.id === pkg.id ? 'bg-amber-500/10 ring-2 ring-amber-500 border-transparent' : 'bg-gray-800/50 hover:bg-gray-800/70 border-white/5'"
              class="p-3 rounded-lg transition-all">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-1.5">
                  <span class="text-yellow-400 text-base">⚡</span>
                  <span class="text-base font-bold text-white">{{ pkg.energy.toLocaleString() }}</span>
                </div>
                <span class="text-xs text-gray-400">{{ pkg.duration }}</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-bold text-amber-400">{{ pkg.price.toFixed(2) }}</span>
                <span class="text-xs text-gray-400">TRX</span>
              </div>
            </button>
          </div>
        </div>
        <template v-if="paymentMethod === 'qr'">
          <div class="bg-amber-500/10 ring ring-amber-500 rounded-xl p-4">
            <h3 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Payment Instructions
            </h3>

            <div class="flex flex-col md:flex-row gap-4 items-end">
              <div class="w-full md:flex-1 space-y-3 text-xs text-amber-100">
                <div class="flex gap-3 items-start">
                  <div
                    class="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0 mt-0.5">
                    1</div>
                  <p class="pt-0.5 text-gray-300">Scan QR or copy address below</p>
                </div>
                <div class="flex gap-3 items-start">
                  <div
                    class="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0 mt-0.5">
                    2</div>
                  <p class="pt-0.5 text-gray-300">Send <span class="text-yellow-400 font-bold">{{
                    selectedPackage.price.toFixed(2) }} TRX</span></p>
                </div>
                <div class="flex gap-3 items-start">
                  <div
                    class="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0 mt-0.5">
                    3</div>
                  <p class="pt-0.5 text-gray-300">Receive <span class="text-yellow-400 font-semibold">{{
                    selectedPackage.energy.toLocaleString() }} Energy</span> instantly</p>
                </div>

                <div class="pt-4 border-t border-white/5">
                  <p class="text-xs text-amber-300 mb-2 uppercase font-semibold tracking-wider">Payment Address</p>
                  <div class="flex gap-2">
                    <input readonly
                      class="flex-1 text-[11px] bg-gray-950/80 px-3 py-2.5 rounded border border-amber-500/30 text-yellow-400 focus:outline-none"
                      type="text" :value="walletA" />
                    <button @click="copyWallet"
                      class="px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded transition-all text-xs">
                      📋
                    </button>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-auto flex justify-center shrink-0">
                <div class="bg-white p-3 rounded-lg shadow-xl shadow-black/50">
                  <img width="160" height="160" alt="QR Payment" class="w-32 h-32 sm:w-36 sm:h-36"
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletA}`" />
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-3">
            <div class="bg-gray-800/30 border border-white/5 rounded-xl p-3">
              <p class="text-xs font-semibold text-yellow-400 mb-1.5 flex items-center gap-1">⚠️ Important:</p>
              <ul class="text-xs text-yellow-200 space-y-1 list-disc list-inside pl-1">
                <li>This address accepts only <span class="font-bold">TRX (TRON)</span> tokens.</li>
                <li>Sending other cryptocurrencies may result in loss of funds.</li>
                <li>Minimum amount for energy rental is 3.00 TRX.</li>
              </ul>
            </div>
            <a href="https://t.me/tronfeeazbot" target="_blank" rel="noopener noreferrer"
              class="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-4 transition-all text-center shadow-lg shadow-blue-600/10">
              <img src="../assets/image/telegram.svg" class="brightness-0 invert" width="16" height="16"
                style="color:transparent" />
              <span class="text-xs font-bold">Join Telegram - Get price alerts & deals</span>
            </a>
          </div>
        </template>
        <template v-else-if="paymentMethod === 'tronlink'">
          <button 
            disabled
            class="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all">Connect
            Wallet First</button>
        </template>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div class="bg-gray-800/20 border border-white/5 rounded-xl p-4 text-center">
        <div class="text-2xl mb-1">💰</div>
        <h3 class="text-xs font-bold text-white mb-0.5">Save 80%</h3>
        <p class="text-[10px] text-gray-500">Lower fees vs burning TRX</p>
      </div>
      <div class="bg-gray-800/20 border border-white/5 rounded-xl p-4 text-center">
        <div class="text-2xl mb-1">⚡</div>
        <h3 class="text-xs font-bold text-white mb-0.5">Instant</h3>
        <p class="text-[10px] text-gray-500">Delivered in a few seconds</p>
      </div>
      <div class="bg-gray-800/20 border border-white/5 rounded-xl p-4 text-center">
        <div class="text-2xl mb-1">🔒</div>
        <h3 class="text-xs font-bold text-white mb-0.5">Secure</h3>
        <p class="text-[10px] text-gray-500">No private keys needed</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const paymentMethod = ref('qr')
const packages = [
  { id: 1, energy: 65000, duration: '1h', price: 3.0 },
  { id: 2, energy: 131000, duration: '1h', price: 5.6 },
  { id: 3, energy: 195000, duration: '1h', price: 8.5 },
  { id: 4, energy: 260000, duration: '1h', price: 11.0 },
]
const selectedPackage = ref(packages[0])
const walletA = ref('TBxcnznndzRgx1an4fy6hK8xqswtzH4WSH')

function copyWallet() {
  navigator.clipboard.writeText(walletA.value)
  alert('Copied payment address successfully!')
}
</script>
