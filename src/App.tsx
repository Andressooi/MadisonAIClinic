import { SiteNav } from './components/SiteNav'
import { Hero } from './components/Hero'
import { TheCase } from './components/TheCase'
import { Services } from './components/Services'
import { Audience } from './components/Audience'
import { HonestVersion } from './components/HonestVersion'
import { Faq } from './components/Faq'
import { Closing } from './components/Closing'
import { SiteFooter } from './components/SiteFooter'

function App() {
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Hero />
        <TheCase />
        <div className="container">
          <Services />
          <hr className="hr services-divider" />
          <Audience />
          <hr className="hr" />
          <HonestVersion />
          <hr className="hr" />
          <Faq />
        </div>
        <Closing />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
