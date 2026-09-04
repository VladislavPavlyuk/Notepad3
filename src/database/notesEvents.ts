type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeNotesChanged(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyNotesChanged() {
  listeners.forEach(listener => listener());
}
