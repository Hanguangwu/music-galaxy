<script setup lang="ts">
import { ref } from 'vue'
import { useSearchStore } from '@/stores/search'
import { usePlayerStore } from '@/stores/player'
import { t } from '@/utils/i18n'
import type { MusicSource } from '@/types/music'
import SearchInput from './SearchInput.vue'
import SourceSelector from './SourceSelector.vue'
import SearchResultItem from './SearchResultItem.vue'

const props = defineProps<{
  lang: 'zh' | 'en'
}>()

const searchStore = useSearchStore()
const playerStore = usePlayerStore()

const keyword = ref(searchStore.keyword)
const selectedSources = ref<MusicSource[]>([...searchStore.enabledSources])
const limit = ref(searchStore.perSourceLimit)
const listRef = ref<HTMLElement | null>(null)

function doSearch(reset = true) {
  searchStore.keyword = keyword.value
  searchStore.setSources(selectedSources.value)
  searchStore.perSourceLimit = limit.value
  searchStore.doSearch(reset)
}

function loadMore() {
  searchStore.loadMore()
}

function onResultPlay(track: any) {
  const idx = searchStore.results.findIndex((t) => t.uid === track.uid)
  if (idx >= 0) {
    playerStore.play(track, 'results', idx)
  }
}

function onScroll() {
  const el = listRef.value
  if (!el) return
  if (searchStore.loading || searchStore.noMoreResults) return
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
    loadMore()
  }
}
</script>

<template>
  <section class="panel search-panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="icon">🔍</span>
        <span>{{ t("searchTitle", lang) }}</span>
      </div>
      <span class="chip">{{ t("searchSubtitle", lang) }}</span>
    </div>
    <div class="search-panel-content">
      <SearchInput
        v-model="keyword"
        :lang="lang"
        @search="doSearch(true)"
      />

      <SourceSelector
        v-model:sources="selectedSources"
        :lang="lang"
      />

      <div class="limit-row">
        <span>{{ t("perSourceCount", lang) }}</span>
        <select v-model.number="limit">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="30">30</option>
        </select>
        <span>{{ t("perSourceCountTail", lang) }}</span>
        <button
          class="btn btn-secondary"
          :disabled="searchStore.loading || searchStore.noMoreResults"
          @click="loadMore"
        >
          {{ t("loadMore", lang) }}
        </button>
      </div>

      <div class="search-stats">
        <span id="search-status">
          {{ searchStore.loading ? t("searchStatusSearching", lang) : searchStore.noMoreResults ? t("searchStatusDone", lang) : t("searchStatusIdle", lang) }}
        </span>
        <span>{{ searchStore.results.length }}</span>
      </div>

      <div
        ref="listRef"
        class="search-results-mini"
        @scroll="onScroll"
      >
        <SearchResultItem
          v-for="(track, idx) in searchStore.results"
          :key="track.uid"
          :track="track"
          :index="idx"
          :lang="lang"
          @play="onResultPlay(track)"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.search-panel-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  flex: 1;
}
.chip {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.25);
  color: var(--text-sub, #a1a6d0);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.limit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}
.limit-row select {
  background: rgba(5, 7, 24, 0.8);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: var(--text-main, #f5f6ff);
  padding: 3px 8px;
  font-size: 11px;
  outline: none;
}
.btn-secondary {
  background: radial-gradient(circle at 30% 0, rgba(255, 255, 255, 0.05), rgba(80, 100, 180, 0.95));
  color: var(--text-main, #f5f6ff);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.btn-secondary:active {
  transform: translateY(1px) scale(0.97);
}
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.search-stats {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-sub, #a1a6d0);
}
.search-results-mini {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
  margin-top: 4px;
}
</style>
