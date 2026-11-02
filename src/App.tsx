import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { About } from '@/components/sections/About'
import { CompetitiveProgramming } from '@/components/sections/CompetitiveProgramming'
import { Contact } from '@/components/sections/Contact'
import { Education } from '@/components/sections/Education'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

function App() {
  return (
    <div className='relative min-h-screen bg-void text-star'>
      <a
        href='#main'
        className='sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-hot focus:bg-void focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.3em] focus:text-star'
      >
        Skip to content
      </a>

      <Navbar />

      <main id='main'>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <CompetitiveProgramming />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App
