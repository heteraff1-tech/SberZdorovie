import { onScopeDispose, ref } from 'vue';

/** Возвращает реактивный hash адреса и снимает подписку при размонтировании. */
export function useLocationHash() {
  const hash = ref(window.location.hash);
  const update = () => {
    hash.value = window.location.hash;
  };
  window.addEventListener('hashchange', update);
  onScopeDispose(() => window.removeEventListener('hashchange', update));
  return hash;
}
