import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { cookies } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    const cookieStore = await cookies()
    locale = cookieStore.get('NEXT_LOCALE')?.value || routing.defaultLocale
  }

  const common = (await import(`../../messages/${locale}/common.json`)).default
  const landing = (await import(`../../messages/${locale}/landing.json`)).default
  const auth = (await import(`../../messages/${locale}/auth.json`)).default
  const bookDemo = (await import(`../../messages/${locale}/bookDemo.json`)).default
  const pricing = (await import(`../../messages/${locale}/pricing.json`)).default
  const services = (await import(`../../messages/${locale}/services.json`)).default
  const dashboard = (await import(`../../messages/${locale}/dashboard.json`)).default
  const assets = (await import(`../../messages/${locale}/assets.json`)).default
  const blogs = (await import(`../../messages/${locale}/blogs.json`)).default
  const leave = (await import(`../../messages/${locale}/leave.json`)).default
  const employees = (await import(`../../messages/${locale}/employees.json`)).default
  const departments = (await import(`../../messages/${locale}/departments.json`)).default
  const insurance = (await import(`../../messages/${locale}/insurance.json`)).default
  const projects = (await import(`../../messages/${locale}/projects.json`)).default


  const timesheet = (await import(`../../messages/${locale}/timesheet.json`)).default
  const company = (await import(`../../messages/${locale}/company.json`)).default
  const reports = (await import(`../../messages/${locale}/reports.json`)).default
  const jobs = (await import(`../../messages/${locale}/jobs.json`)).default
  const chatbot = (await import(`../../messages/${locale}/chatbot.json`)).default
  const profile = (await import(`../../messages/${locale}/profile.json`)).default

  return {
    locale: locale as typeof routing.locales[number],
    messages: {
      common,
      landing,
      auth,
      bookDemo,
      dashboard,
      assets,
      pricing,
      services,
      leave,
      blogs,
      departments,
      employees,
      insurance,
      reports,
      timesheet,
      company,
      projects,
      jobs,
      chatbot,
      profile
    },
  }
})