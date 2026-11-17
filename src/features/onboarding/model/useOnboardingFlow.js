import { computed, onMounted, onScopeDispose, reactive, ref, watch } from 'vue';
import { useReducedMotion } from '@/shared/composables/useReducedMotion';
import { readMotionDuration } from '@/shared/lib/motion';
import { easeBetween } from '@/shared/lib/easing';
import { OnboardingFlow } from './OnboardingFlow';
import { PullGesture } from './PullGesture';

export function useOnboardingFlow(onComplete) {
  const state = reactive({
    phase: 'blank',
    curtain: 'off',
    pull: 0,
    tension: 0,
    merge: 0,
    finishing: false,
  });
  const reducedMotion = useReducedMotion();
  const flow = new OnboardingFlow(state, () => reducedMotion.value, readMotionDuration);
  const gesture = new PullGesture();
  const contact = ref(0);
  const showAction = computed(() => ['welcome', 'connect'].includes(state.phase));
  const canPull = computed(() => flow.canPull);
  const fill = computed(() => (state.phase === 'pull' ? easeBetween(0.32, 0.96, state.merge) : 1));
  const isFilling = computed(() => state.phase === 'pull' && fill.value > 0 && fill.value < 1);
  const showWave = computed(
    () => state.phase === 'done' || (state.phase === 'pull' && fill.value >= 0.8),
  );
  let completionTimer;

  function startPull(event) {
    if (!flow.canPull) return;
    const surface = event.currentTarget;
    const scale = surface.getBoundingClientRect().height / surface.offsetHeight;
    if (!gesture.start(event, scale, state.pull)) return;
    flow.grab();
    surface.setPointerCapture(event.pointerId);
  }

  function movePull(event) {
    const sample = gesture.move(event);
    if (sample) flow.setPull(sample.progress, sample.speed);
  }

  function endPull(event, cancelled = false) {
    const result = gesture.end(event, cancelled);
    if (!result) return;
    if (result.complete) flow.finish(result.speed);
    else flow.release();
  }

  watch(
    () => state.phase,
    (phase) => {
      if (phase === 'done')
        completionTimer = setTimeout(onComplete, readMotionDuration('onboarding-hold'));
    },
  );
  onMounted(() => flow.start());
  onScopeDispose(() => {
    flow.dispose();
    clearTimeout(completionTimer);
  });

  return {
    state,
    contact,
    showAction,
    canPull,
    fill,
    isFilling,
    showWave,
    startPull,
    movePull,
    endPull,
    advance: () => flow.advance(),
    finish: () => flow.finish(),
  };
}
