// Entry point — shared styles + component initialisation.
//
// The Header markup is static HTML injected at build/dev time by the
// sharedHeader Vite plugin (see vite.config.js), so no runtime rendering
// is required here. JavaScript is responsible for the theme system and for
// the Part 2 interactions.
import { initTheme } from './theme.js'
import { initBurgerMenu } from './burgerMenu.js'


import '../styles/reset.css'
import '../styles/variables.css'
import '../styles/global.css'
import '../styles/utilities.css'
import '../components/Header/Header.css'
import '../components/Footer/Footer.css'
import '../components/ThemeToggle/ThemeToggle.css'
import '../components/Button/Button.css'
import '../components/ProductModal/ProductModal.css'

initTheme()
initBurgerMenu()
