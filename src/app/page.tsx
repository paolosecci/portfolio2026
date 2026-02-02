"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Mail, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#3F3C2b] to-[#2b2625] text-[#b3a081]">
      <section className="relative pt-32 pb-24 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block mb-8">
              <Image
                src="/FashionablePaolo.JPG"
                alt="Paolo D. Secci"
                width={300}
                height={300}
                className="rounded-full mx-auto shadow-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-full border-8 border-[#2b2625]" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-[#9e8a68]">
              Paolo Secci
            </h1>
            <p className="text-2xl md:text-3xl text-[#9e8a68] mb-8 max-w-4xl mx-auto">
              AI Systems Engineer | Cloud-Native & Full-Stack Architect
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <Button size="lg" className="bg-[#2b2625] hover:bg-[#2b291b]/90 text-[#b3a081]" asChild>
                <a href="https://github.com/paolosecci" target="_blank">
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </a>
              </Button>
              <Button size="lg" className="bg-[#2b2625] hover:bg-[#2b291b]/90 text-[#b3a081]" asChild>
                <a href="mailto:paolosecci98@gmail.com">
                  <Mail className="mr-2 h-5 w-5" /> Contact Me
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="projects" className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 text-[#9e8a68]"
          >
            Live Production Apps
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden bg-[#2b291b]/90 border-[#3F3C2b]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-bl from-[#9e8a68] to-[#3F3C2b] relative">
                  
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <Image
                        src="/Dante&Virgil.png"
                        alt="Virgil and Dante in the Inferno"
                        fill
                        className="object-cover object-center opacity-70 mix-blend-soft-light"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <Badge variant="secondary" className="mb-2 bg-[#9e8a68]/20 text-[#a3967f]">Most Advanced</Badge>
                    <h3 className="text-3xl font-bold text-[#a3967f]">Virgil the AI Tutor</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-[#b3a081] mb-6">
                    Real-time multi-modal RAG tutor with contextual document analysis and PDF highlighting 
                  </p>
                  <Button asChild className="w-full bg-[#3F3C2b] hover:bg-[#3F3C2b]/90 text-[#b3a081]">
                    <a href="https://virgil.paolo.run" target="_blank">
                      Launch Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden bg-[#2b291b]/90 border-[#3F3C2b]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="h-64 bg-gradient-to-bl from-[#9e8a68] to-[#3F3C2b] relative">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <Image
                        src="/BasketPlaybook.png"
                        alt="Coach Playbook"
                        fill
                        className="object-cover object-center opacity-70 mix-blend-soft-light"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <Badge variant="secondary" className="mb-2 bg-[#9e8a68]/20 text-[#a3967f]">Updated Nightly</Badge>
                    <h3 className="text-3xl font-bold text-[#a3967f]">Le Swish Prophet</h3>
                  </div>
                </div>
                <CardContent className="p-8">
                  <p className="text-[#b3a081] mb-6">
                    NBA prediction engine beating Vegas 62% ATS since 2019 — fully automated daily ETL on GCP
                  </p>
                  <Button asChild className="w-full bg-[#3F3C2b] hover:bg-[#3F3C2b]/90 text-[#b3a081]">
                    <a href="https://lsp.paolo.run" target="_blank">
                      See Today’s Picks <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* <section id="skills" className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-12 text-[#9e8a68]"
          >
            Tech Stacks Shipped in Production
          </motion.h2>
          <Card className="bg-[#2b291b] border-[#3F3C2b]">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#3F3C2b]/80">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-[#9e8a68]">Context</th>
                      <th className="px-6 py-4 font-semibold text-[#9e8a68]">Technologies & Stacks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#3F3C2b]">
                      <td className="px-6 py-4 font-medium text-[#9e8a68]">Turing LLM Fine-Tuning</td>
                      <td className="px-6 py-4 text-[#9e8a68]">SFT, LangChain/LangGraph, Llama-3.1-70B, Groq/Together.ai, tool-use evaluation</td>
                    </tr>
                    <tr className="border-b border-[#3F3C2b]">
                      <td className="px-6 py-4 font-medium text-[#9e8a68]">AI Tutor (RAG)</td>
                      <td className="px-6 py-4 text-[#9e8a68]">Next.js 15, FastAPI, LLaVA, Neo4j, Qdrant/Pinecone, ElevenLabs TTS</td>
                    </tr>
                    <tr className="border-b border-[#3F3C2b]">
                      <td className="px-6 py-4 font-medium text-[#9e8a68]">ESA CubeSat Flight Software</td>
                      <td className="px-6 py-4 text-[#9e8a68]">Embedded C, GomSpace OBC, ECSS standards, real-time FDIR</td>
                    </tr>
                    <tr className="border-b border-[#3F3C2b]">
                      <td className="px-6 py-4 font-medium text-[#9e8a68]">Gucci.com E-Commerce</td>
                      <td className="px-6 py-4 text-[#9e8a68]">React, Node.js, TypeScript, Java Spring Boot, SAP Hybris, Jenkins CI/CD</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium text-[#9e8a68]">Le Swish Prophet</td>
                      <td className="px-6 py-4 text-[#9e8a68]">Next.js, TensorFlow/Keras, Selenium ETL, Apache Spark, BigQuery, GCP Scheduler</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      <footer className="relative py-12 text-center text-[#9e8a68]">
        © 2026 Paolo Secci · Built with Next.js 15, Tailwind, & Vercel
      </footer>
    </main>
  );
}
