import PublicNavbar from "@/components/layout/PublicNavbar";
import { BookOpen, CheckCircle, Play, Star, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <PublicNavbar />

      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-accent-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-700/50 text-brand-200 text-sm px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" />
              Plataforma de aprendizaje online
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Aprende sin límites,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-accent-300">
                crece sin parar
              </span>
            </h1>
            <p className="text-lg text-brand-200 mb-10 max-w-xl">
              Accede a cursos de calidad impartidos por expertos. Aprende a tu
              ritmo, obtén certificados y lleva tu carrera al siguiente nivel.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="bg-white text-brand-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors"
              >
                Ver cursos gratis
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl border border-brand-500 hover:bg-brand-500 transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-12 text-sm text-brand-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>+10,000 estudiantes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>+200 cursos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
                <span>4.9 valoración promedio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-app">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-content mb-4">
              Todo lo que necesitas para aprender
            </h2>
            <p className="text-content-muted max-w-xl mx-auto">
              Una plataforma completa diseñada para que puedas enfocarte en lo
              que importa: aprender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-surface rounded-2xl p-8 border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-content mb-2">
                  {feature.title}
                </h3>
                <p className="text-content-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-content mb-4">
              Empieza en 3 pasos
            </h2>
            <p className="text-content-muted">
              Comenzar es más fácil de lo que crees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 bg-brand-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-5">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-content mb-2">
                  {step.title}
                </h3>
                <p className="text-content-muted text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-app">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-content mb-4">
              Lo que dicen nuestros estudiantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-surface rounded-2xl p-6 border border-border"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="w-4 h-4 fill-warning-400 text-warning-400"
                    />
                  ))}
                </div>
                <p className="text-content-muted text-sm leading-relaxed mb-5">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-content">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-content-soft">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-accent-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-brand-200 mb-8 text-lg">
            Únete a miles de estudiantes que ya están aprendiendo en Aulix. Tu
            primera lección es gratis.
          </p>
          <Link
            href="/register"
            className="bg-white text-brand-700 font-semibold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors inline-block text-lg"
          >
            Comenzar gratis ahora
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-content-soft py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-400" />
              <span className="text-white font-bold text-lg">Aulix</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/courses" className="hover:text-white transition-colors">
                Cursos
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Iniciar sesión
              </Link>
              <Link href="/register" className="hover:text-white transition-colors">
                Registrarse
              </Link>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Aulix. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Play,
    title: "Aprende a tu ritmo",
    description:
      "Accede a los cursos cuando quieras, desde cualquier dispositivo. Sin horarios fijos ni presión.",
  },
  {
    icon: CheckCircle,
    title: "Certificados verificables",
    description:
      "Al completar un curso obtienes un certificado digital con código QR de verificación.",
  },
  {
    icon: Users,
    title: "Instructores expertos",
    description:
      "Aprende de profesionales con experiencia real en la industria que comparten lo que funciona.",
  },
];

const steps = [
  {
    title: "Crea tu cuenta",
    description:
      "Regístrate gratis en menos de un minuto. Solo necesitas tu email.",
  },
  {
    title: "Elige tu curso",
    description:
      "Explora nuestro catálogo y encuentra el curso que mejor se adapta a tus objetivos.",
  },
  {
    title: "Aprende y certifícate",
    description:
      "Completa las lecciones a tu ritmo y obtén tu certificado al finalizar.",
  },
];

const testimonials = [
  {
    text: "Gracias a Aulix pude aprender programación desde cero y conseguir mi primer trabajo como desarrollador en solo 6 meses.",
    name: "Carlos Mendoza",
    role: "Desarrollador Frontend",
  },
  {
    text: "Los cursos son muy prácticos y bien estructurados. Los instructores explican todo de forma clara y con ejemplos reales.",
    name: "María González",
    role: "Diseñadora UX",
  },
  {
    text: "La mejor inversión que he hecho en mi carrera. Completé 3 cursos y cada uno me abrió nuevas oportunidades laborales.",
    name: "Andrés Jiménez",
    role: "Product Manager",
  },
];
