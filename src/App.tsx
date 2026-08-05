import { SiteNav } from './components/SiteNav'
import { Hero } from './components/Hero'
import { TheShift } from './components/TheShift'
import { WhyNow } from './components/WhyNow'
import { WhatItLooksLike } from './components/WhatItLooksLike'
import { Audience } from './components/Audience'
import { Proof } from './components/Proof'
import { HonestVersion } from './components/HonestVersion'
import { Pricing } from './components/Pricing'
import { Faq } from './components/Faq'
import { WhoWeAre } from './components/WhoWeAre'
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
        <TheShift />
        <WhyNow />
        <div className="container">
          <WhatItLooksLike />
          <hr className="hr" />
          <Audience />
          <hr className="hr" />
          <Proof />
          <hr className="hr" />
          <HonestVersion />
          <hr className="hr" />
          <Pricing />
          <hr className="hr" />
          <Faq />
          <hr className="hr" />
          <WhoWeAre />
        </div>
        <Closing />
      </main>
      <SiteFooter />
    </div>
  )
}

export default App
