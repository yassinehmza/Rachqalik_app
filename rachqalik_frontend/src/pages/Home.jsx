import pillowImage from '../assets/baa7c904-0964-4b4e-9c53-b4a899f3c7f5.png'
import LightRays from '../components/LightRays'
import { LayeredText } from '../components/ui/layered-text'

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-rays-layer" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffb347"
            raysSpeed={1.35}
            lightSpread={0.9}
            rayLength={1.35}
            pulsating={true}
            fadeDistance={1.2}
            saturation={1}
            followMouse={true}
            mouseInfluence={0.14}
            noiseAmount={0.03}
            distortion={0.05}
          />
        </div>

        <div className="container hero-grid">
          <div className="hero-content">
            <LayeredText />
          </div>

          <div className="hero-image-wrap">
            <div className="hero-glow" aria-hidden="true" />
            <img src={pillowImage} alt="Oreiller Rachqalik" className="hero-image" />
          </div>
        </div>
      </section>

      <section className="insights-section">
        <div className="container">
          <div className="insights-content">
            <h2 className="insights-title">
              Sleep Insights with<br />Dr. Mike Gradisar
            </h2>
            <p className="insights-text">
              Unlock the secrets to better recovery with The Science of Sleep, a captivating online
              masterclass series featuring Dr. Mike Gradisar, a world-renowned sleep expert. From
              the wild sleep patterns of teens to the busy nights of early adults in their 20s and 30s,
              the joys and jumbles of parenting young kids, the changes of menopause, and must-know advice for all, this series has you covered. With Dr. Gradisar's 25 years of
              expertise, you'll gain fun, practical insights to tackle sleep challenges at every stage,
              turning restless nights into mornings full of energy and possibility!
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
