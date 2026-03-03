// Global state with composables, not related to a specific page or component

const menuOpen = ref(false)

export const useMenu = () => {
  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }

  return {
    menuOpen,
    toggleMenu
  }
}
