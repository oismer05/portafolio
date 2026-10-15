import { FaCss3Alt, FaGolang, FaHtml5 } from 'react-icons/fa6'
import { TbSql } from 'react-icons/tb'
import {
  SiAngular,
  SiDjango,
  SiExpress,
  SiFastapi,
  SiJavascript,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si'
import type { SkillGroup } from '@/types'

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    accent: 'lavender',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Angular', icon: SiAngular },
      { name: 'Vue', icon: SiVuedotjs },
      { name: 'HTML', icon: FaHtml5 },
      { name: 'CSS', icon: FaCss3Alt },
    ],
  },
  {
    title: 'Backend',
    accent: 'mint',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'NestJS', icon: SiNestjs },
      { name: 'Express', icon: SiExpress },
      { name: 'Laravel', icon: SiLaravel },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Django', icon: SiDjango },
    ],
  },
  {
    title: 'Lenguajes',
    accent: 'peach',
    skills: [
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'PHP', icon: SiPhp },
      { name: 'Python', icon: SiPython },
      { name: 'Go', icon: FaGolang },
    ],
  },
  {
    title: 'Bases de datos',
    accent: 'sky',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MySQL', icon: SiMysql },
      { name: 'SQL Server', icon: TbSql },
      { name: 'MongoDB', icon: SiMongodb },
    ],
  },
]

/** Competencias transversales (sin ícono de marca) */
export const softSkills: string[] = [
  'Arquitectura multi-tenant',
  'Pasarelas de pago',
  'Productos marca blanca',
  'Trabajo en equipo',
  'Desarrollo asistido por IA',
  'Levantamiento de procesos',
]

/** Todas las tecnologías en una lista plana (para el carrusel infinito) */
export const allTechnologies = skillGroups.flatMap((group) => group.skills)
