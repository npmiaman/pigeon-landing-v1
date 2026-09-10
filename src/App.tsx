import { Nav } from '@/sections/nav'
import { Hero } from '@/sections/hero'
import { Pipeline } from '@/sections/pipeline'
import { Product } from '@/sections/product'
import { Numbers } from '@/sections/numbers'
import { Rules } from '@/sections/rules'
import { Why } from '@/sections/why'
import { Faq } from '@/sections/faq'
import { Cta, Footer } from '@/sections/footer'

/**
 * The marketing page, top to bottom. Each section is its own file under
 * `sections/`; the product frames inside them are the dashboard's own
 * components under `components/app/`, with example data from `demo/data.ts`.
 */
function App() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-paper font-sans text-ink antialiased selection:bg-ember-soft selection:text-ink">
      <Nav />
      <main className="flex-1">
        <Hero />
        <Pipeline />
        <Product />
        <Numbers />
        <Rules />
        <Why />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}

export default App
