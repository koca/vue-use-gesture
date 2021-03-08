<template>
  <div class="specs mt-4 pl-4 text-sm border-l-4 border-gray-700 opacity-60 overflow-x-auto">
    <div class="row">
      <div>Type{{ typesValue.length > 1 ? 's' : '' }}</div>
      <template v-if="typesLength < 50">
        {{ typesValue.join(' | ') }}
      </template>
      <template v-else>
        <ul>
          <li :key="val" v-for="val in typesValue">{{ val }}</li>
        </ul>
      </template>
    </div>
    <div class="row">
      <div>Default</div>
      <div>{{ defaultValue }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    types: {
      type: [Array, String],
      required: true,
    },
    defaultValue: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const typesValue = computed(() => (Array.isArray(props.types) ? props.types : [props.types]))
    const typesLength = computed(() => typesValue.value.join('').length)

    return {
      typesValue,
      typesLength,
    }
  },
})
</script>

<style lang="postcss">
.row {
  &:first-child {
    margin-bottom: 10px;
  }
  display: flex;
  white-space: pre;
  padding: 0 4px;
  > div:first-child {
    width: 80px;
    font-weight: 600;
    margin-right: 10px;
    flex-shrink: 0;
  }
  ul {
    margin-top: 0;
    font-size: inherit;
    padding-left: 0;
    li {
      margin: 0;
    }
  }
  code {
    background: none;
    padding: none;
    color: inherit;
  }
}
</style>
