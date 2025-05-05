"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Logo from "@/components/logo"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme("dark")
  }, [])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Умная Автоматизация",
      description: "Автоматизируйте повторяющиеся задачи и рабочие процессы, чтобы сэкономить время и сократить количество ошибок.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Расширенная аналитика",
      description: "Получайте ценную информацию с помощью визуализации данных и отчетности в реальном времени.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Сотрудничество в команде",
      description: "Эффективная совместная работа благодаря интегрированным инструментам коммуникации.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Безопасность предприятия",
      description: "Обеспечьте безопасность своих данных с помощью сквозного шифрования и функций обеспечения соответствия нормативным требованиям.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Полная интеграция",
      description: "Подключайтесь к своим любимым инструментам через нашу обширную экосистему API.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "Круглосуточная поддержка",
      description: "Обращайтесь за помощью в любое время, когда она вам понадобится, к нашей специализированной службе поддержки.",
      icon: <Star className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header
        className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -64 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.7,
            ease: [0.4, 0, 0.2, 1]
          }}

          className="container flex h-16 items-center justify-between"
        >
          <div className="flex items-center gap-2 font-bold">
            <Logo />
          </div>
          <nav className="hidden lg:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Функции
            </Link>
            <Link
              href="#howItWorks"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Как это работает
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Часто задаваемые вопросы
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Войти
            </Link>
            <Link href="/sign-up">
              <Button className="rounded-full">
                Начать бесплатно
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </Link>

          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Открыть меню</span>
            </Button>
          </div>
        </motion.div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden top-16 inset-x-0 backdrop-blur-lg border-b"
          >
            <div className="container py-4 flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Функции
              </Link>
              <Link
                href="#howItWorks"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Как это работает
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Часто задаваемые вопросы
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/sign-in"
                  className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Войти
                </Link>
                <Link href="/sign-up">
                  <Button className="rounded-full">
                    Начать бесплатно
                    <ChevronRight className="ml-1 size-4" />
                  </Button>
                </Link>

              </div>
            </div>
          </motion.div>
        )}
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full min-h-screen overflow-hidden flex relative -mt-16">
          <div className="container px-4 md:px-6 bg-linear-to-t from-primary to-indigo-500 flex flex-col justify-end">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            <div className="text-center max-w-4xl m-auto pt-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
              >
                <h1>
                  Kanata Planner — Организуйте работу и жизнь.
                </h1>
              </motion.div>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Упростите жизнь себе и своей команде, используя менеджер задач и список дел.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/sign-up">
                  <Button size="lg" className="rounded-full h-12 px-8 text-base">
                    Начать бесплатно
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className=" relative">
              <div className="absolute -bottom-6 right-24 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 left-24 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
              <div
                className=
                "hidden xl:block absolute -top-4 right-72 z-20"
              >
                <motion.div
                  initial={{
                    opacity: 0.001,
                    transform: "perspective(1200px) scale(0.8) rotateX(-90deg)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "perspective(1200px) scale(1) rotateX(0deg)",
                  }}
                  transition={{
                    duration: .8, delay: 0.5,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                  }}

                >
                  <div className="p-3 bg-card border rounded-xl border-l-8 flex flex-col gap-y-6  min-w-[250px] border-l-emerald-500 text-base shadow-xl">
                    <p className="h-6 bg-skeleton w-[80px] rounded-md"></p>
                    <div className="flex items-center gap-x-2">
                      <div className="size-8 rounded-full bg-skeleton"></div>
                      <div className="size-2 rounded-full bg-skeleton" />
                      <div className="size-8 rounded-md bg-skeleton"></div>
                      <p className="h-6 bg-skeleton w-[150px] rounded-md"></p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div
                className=
                "hidden xl:block absolute bottom-14 left-56 z-20"
              >
                <motion.div
                  initial={{
                    opacity: 0.001,
                    transform: "perspective(1200px) scale(0.8) rotateX(-90deg)",
                  }}
                  animate={{
                    opacity: 1,
                    transform: "perspective(1200px) scale(1) rotateX(0deg)",
                  }}
                  transition={{
                    duration: .8, delay: 0.6,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    willChange: "transform, opacity",
                    transformStyle: "preserve-3d",
                  }}

                >
                  <div className="p-3 bg-card border rounded-xl border-l-8 flex flex-col gap-y-6  min-w-[250px] border-l-blue-500 text-base shadow-xl">
                    <p className="h-6 bg-skeleton w-[120px] rounded-md"></p>
                    <div className="flex items-center gap-x-2">
                      <div className="size-8 rounded-full bg-skeleton"></div>
                      <div className="size-2 rounded-full bg-skeleton" />
                      <div className="size-8 rounded-md bg-skeleton"></div>
                      <p className="h-6 bg-skeleton w-[200px] rounded-md"></p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{
                  opacity: 0.001,
                  transform: "perspective(1200px) translateY(110px) scale(0.8) rotateX(-30deg)",
                }}
                animate={{
                  opacity: 1,
                  transform: "perspective(1200px) translateY(0px) scale(1) rotateX(0deg)",
                }}
                transition={{
                  duration: .8,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  willChange: "transform, opacity",
                  transformStyle: "preserve-3d",
                }}
                className="relative mx-auto max-w-5xl"
              >
                <div className="rounded-t-[5px] overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20 min-w-[700px]">
                  <Image
                    src={theme === "light" ? "/img/app-screen-light.png" : "/img/app-screen-dark.png"}
                    width={1280}
                    height={720}
                    alt="SaaSify dashboard"
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Функции
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Все, что вам нужно для успеха</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Наша комплексная платформа предоставляет все необходимые инструменты для оптимизации рабочего процесса, повышения производительности и достижения ваших целей.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="howItWorks" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Как это работает
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Простой процесс, впечатляющие результаты</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Начните работу за считанные минуты и посмотрите, какие преимущества наша платформа может принести вашей жизни или бизнесу.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              {[
                {
                  step: "01",
                  title: "Зарегистрироваться",
                  description: "Зарегистрируйтесь за считанные секунды, используя только свой адрес электронной почты.",
                },
                {
                  step: "02",
                  title: "Настроить рабочее пространство",
                  description: "Настройте свое рабочее пространство в соответствии с уникальным рабочим процессом и требованиями вашей команды.",
                },
                {
                  step: "03",
                  title: "Повышение производительности",
                  description: "Начните использовать наши мощные функции для оптимизации процессов и достижения своих целей.",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center space-y-4"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-background-foreground text-xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Часто задаваемые вопросы
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Часто задаваемые вопросы</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Найдите ответы на распространенные вопросы о нашей платформе.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "Есть ли ограничение на количество добавляемых пользователей?",
                    answer:
                      "Количество пользователей зависит от вашего плана. План Starter допускает до 5 членов команды, план Professional допускает до 20, а план Enterprise не имеет ограничений по числу членов команды.",
                  },
                  {
                    question: "Предлагаете ли вы скидки некоммерческим организациям или образовательным учреждениям?",
                    answer:
                      "Да, мы предлагаем специальные цены для некоммерческих организаций, образовательных учреждений и проектов с открытым исходным кодом. Пожалуйста, свяжитесь с нашей командой по продажам для получения дополнительной информации.",
                  },
                  {
                    question: "Насколько защищены мои данные?",
                    answer:
                      "Мы очень серьезно относимся к безопасности. Все данные шифруются как при передаче, так и при хранении. Мы используем отраслевые стандартные методы безопасности и регулярно проходим аудиты безопасности. Наша платформа соответствует GDPR, CCPA и другим соответствующим нормам.",
                  },
                  {
                    question: "Какую поддержку вы предлагаете?",
                    answer:
                      "Поддержка зависит от плана. Все планы включают поддержку по электронной почте, а план Professional предлагает приоритетную поддержку по электронной почте. План Enterprise включает круглосуточную поддержку по телефону и электронной почте. У нас также есть обширная база знаний и форум сообщества, доступные всем пользователям.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>
          <div className="absolute -bottom-6 right-24 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
          <div className="absolute -top-6 left-24 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center text-background-foreground">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-background-foreground">
                Готовы ли вы преобразовать свой рабочий процесс?
              </h2>
              <p className="mx-auto max-w-[700px] md:text-xl text-background-foreground">
                Присоединяйтесь к тысячам довольных клиентов, которые оптимизировали свои процессы и повысили производительность с помощью нашей платформы.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link href="/sign-up">

                  <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">
                    Начать бесплатно
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <Logo />
              </div>
              <p className="text-sm text-muted-foreground">
                Оптимизируйте свой рабочий процесс с помощью нашей универсальной SaaS-платформы. Повышайте производительность и масштабируйте свой бизнес.
              </p>

            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Функции
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Интеграции
                  </Link>
                </li>
                <li>
                  <Link href="#howItWorks" className="text-muted-foreground hover:text-foreground transition-colors">
                    Как это работает
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    Часто задаваемые вопросы
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Ресурсы</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Документация
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Руководства
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Поддерживать
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Компания</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    О компания
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Карьера
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Условия обслуживания
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Katana. Все права защищены.

            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Политика конфиденциальности
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Условия обслуживания
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Политика использования файлов cookie
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div >
  )
}
