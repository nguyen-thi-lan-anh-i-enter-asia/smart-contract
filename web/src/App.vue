<template>
  <div class="min-h-screen flex flex-col bg-linear-to-br from-black via-gray-950 to-gray-900 text-white font-sans">
    
    <header class="bg-white/5 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-black/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="flex items-center space-x-2 group">
            <div class="w-10.5 h-10.5 bg-amber-500 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 text-black font-bold">
              ⚡
            </div>
            <span class="text-xl font-bold bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              TronFeeAZ.com
            </span>
          </router-link>
          <nav class="hidden md:flex items-center space-x-8">
            <router-link to="/" class="text-amber-200 hover:text-yellow-400 transition-colors font-semibold">Home</router-link>
            <router-link to="/estimate" class="text-amber-200 hover:text-yellow-400 transition-colors font-semibold">Estimate Energy</router-link>
            <router-link to="/transactions" class="text-amber-200 hover:text-yellow-400 transition-colors font-semibold">My Transactions</router-link>
          </nav>

          <div class="flex items-center gap-3">
            <button class="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold text-sm rounded-lg transition-all shadow-lg shadow-amber-500/20">
              Connect TronLink
            </button>
            <button class="md:hidden p-2 rounded-lg text-amber-200 hover:text-yellow-400 hover:bg-white/5 transition-colors" aria-label="Toggle menu">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 py-8 pb-24">
      <router-view />
    </main>

    <footer class="bg-gray-950/80 backdrop-blur-xl border-t border-amber-500/20 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="space-y-2">
            <span class="text-xl font-bold bg-linear-to-r from-yellow-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              TronFeeAZ.com
            </span>
            <p class="text-gray-400 text-xs leading-relaxed">
              Save up to 80% on TRON transaction fees by renting energy. Fast, reliable, and affordable energy rental for your USDT and other TRC20 transfers.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3 text-sm">Quick Links</h4>
            <ul class="space-y-2 text-xs text-amber-300">
              <li><router-link to="/" class="hover:text-yellow-400 transition-colors">Home</router-link></li>
              <li><router-link to="/estimate" class="hover:text-yellow-400 transition-colors">Estimate Energy</router-link></li>
              <li><router-link to="/transactions" class="hover:text-yellow-400 transition-colors">Transactions</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-white mb-3 text-sm">Resources</h4>
            <ul class="space-y-2 text-xs text-amber-300">
              <li><a href="https://tronlink.org/" target="_blank" rel="noopener noreferrer" class="hover:text-yellow-400 transition-colors">TronLink Wallet</a></li>
              <li><a href="https://tronscan.org/" target="_blank" rel="noopener noreferrer" class="hover:text-yellow-400 transition-colors">TronScan</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-500">
          <p>© 2026 TronFeeAZ.com. All rights reserved.</p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
</script>