<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-10">
      <h1 class="text-2xl font-bold text-white mb-3">Energy Estimation Tool</h1>
      <p class="text-xs text-gray-400 max-w-2xl mx-auto">Calculate the energy needed for your TRC20 token transfers.</p>
    </div>

    <div class="bg-gray-900/80 backdrop-blur-xl rounded-lg overflow-hidden mb-6">
      <div class="p-5 space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-2">
            FROM ADDRESS 
            <span class="text-amber-400">*</span>
            </label>
          <div class="flex gap-2">
            <input placeholder="Enter sender address (TXxx...)"
              class="flex-1 px-3 py-2 bg-gray-800/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              type="text" value="">
              <button
                class="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm whitespace-nowrap">
                Use Mine
              </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-2">TO ADDRESS 
            <span class="text-amber-400">*</span>
          </label>
          <input placeholder="Enter recipient address (TXxx...)"
            class="w-full px-3 py-2 bg-gray-800/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="text" value="">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-400 mb-2">TOKEN CONTRACT</label>
          <input
            placeholder="USDT: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
            class="w-full px-3 py-2 bg-gray-800/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            type="text" value="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t">
          <p class="text-gray-500 text-xs mt-1">Default: USDT TRC20. Leave as is for USDT transfers.</p>
        </div>
        <button
          class="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all">
          Estimate Energy
        </button>
      </div>
    </div>
  </div>
</template>
