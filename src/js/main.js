// Entry point — shared styles + theme initialisation.
//
// The Header markup is static HTML injected at build/dev time by the
// sharedHeader Vite plugin (see vite.config.js), so no runtime rendering
// is required here. JavaScript is only responsible for the theme system.
import { initTheme } from './theme.js'

import '../styles/reset.css'
import '../styles/variables.css'
import '../styles/global.css'
import '../styles/utilities.css'
import '../components/Header/Header.css'
import '../components/ThemeToggle/ThemeToggle.css'
import '../components/Button/Button.css'

initTheme()