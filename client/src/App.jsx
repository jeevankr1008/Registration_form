import { useState } from 'react'
import './App.css'

const companies = ['HCLTech', 'TCS', 'Wipro', 'Infosys', 'Accenture', 'Cognizant', 'Capgemini', 'Tech Mahindra', 'IBM', 'Deloitte']
const courses = {
  'Computer Science': ['B.E. Computer Science and Engineering', 'B.Tech Artificial Intelligence and Data Science'],
  'Information Technology': ['B.Tech Information Technology', 'B.E. Computer Technology'],
  'Electronics & Communication': ['B.E. Electronics and Communication Engineering'],
  'Electrical & Electronics': ['B.E. Electrical and Electronics Engineering'],
  Mechanical: ['B.E. Mechanical Engineering', 'B.Tech Mechatronics Engineering'],
  Civil: ['B.E. Civil Engineering'],
}
const blankForm = { studentName: '', gender: '', rollNo: '', dob: '', bloodGroup: '', phone: '', email: '', address: '', department: '', course: '', year: '', section: '', backlogs: '' }
const starterRegistration = { ...blankForm, studentName: 'Aarav Menon', rollNo: 'CSE2024018', department: 'Computer Science', backlogs: '0', companies: ['TCS', 'Accenture', 'Infosys', 'Deloitte'] }

function App() {
  const [view, setView] = useState('register')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(blankForm)
  const [selected, setSelected] = useState([])
  const [registrations, setRegistrations] = useState([starterRegistration])
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const updateField = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }))
  const nextStep = (event) => { event.preventDefault(); if (form.backlogs === '0') setStep(2) }
  const toggleCompany = (company) => setSelected((current) => current.includes(company) ? current.filter((item) => item !== company) : current.length < 4 ? [...current, company] : current)
  const submit = async (event) => {
    event.preventDefault()
    if (selected.length !== 4) return

    setSubmitError('')
    const registration = { ...form, companies: selected }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registration),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Registration failed')

      setRegistrations((current) => [...current, registration])
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    }
  }
  const reset = () => { setForm(blankForm); setSelected([]); setSubmitted(false); setSubmitError(''); setStep(1) }
  const count = (company) => registrations.filter((registration) => registration.companies.includes(company)).length

  return <main className="app-shell">
    <header className="topbar"><button className="brand" type="button" onClick={() => setView('register')}><span className="brand-mark">N</span><span><strong>NEXUS</strong><small>CAREER CELL</small></span></button><nav className="top-nav"><button className={view === 'register' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setView('register')}>Student registration</button><button className={view === 'admin' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setView('admin')}>Admin dashboard</button></nav><span className="academic-year">2024 / 25</span></header>
    {view === 'admin' ? <Admin registrations={registrations} count={count} setView={setView} /> : <Registration form={form} updateField={updateField} step={step} setStep={setStep} selected={selected} toggleCompany={toggleCompany} nextStep={nextStep} submit={submit} submitted={submitted} reset={reset} />}
    <footer><span>© 2024 Nexus Career Cell</span><span>Student placement registration portal</span></footer>
  </main>
}

function Registration({ form, updateField, step, setStep, selected, toggleCompany, nextStep, submit, submitted, reset }) {
  return <section className="page registration-page"><div className="page-heading"><div><p className="eyebrow">NEXUS CAREER CELL / STUDENT INTAKE</p><h1>Build your next chapter.</h1><p className="intro">Register your academic profile and choose the companies you want to grow with.</p></div><div className="stepper"><span className={step === 1 ? 'step active' : 'step'}>01 <small>Profile</small></span><i /><span className={step === 2 ? 'step active' : 'step'}>02 <small>Preferences</small></span></div></div>
    {submitted ? <div className="success-state"><div className="success-icon">✓</div><p className="eyebrow">REGISTRATION COMPLETE</p><h2>You are on the list, {form.studentName.split(' ')[0]}.</h2><p>Your profile and four company preferences have been submitted to the placement office.</p><button className="primary-button" type="button" onClick={reset}>Register another student</button></div> : step === 1 ? <Profile form={form} updateField={updateField} nextStep={nextStep} /> : <Preferences selected={selected} toggleCompany={toggleCompany} setStep={setStep} submit={submit} submitError={submitError} />}
  </section>
}

function Profile({ form, updateField, nextStep }) {
  const input = (name, label, type = 'text', placeholder = '') => <label className="field"><span>{label} *</span><input type={type} name={name} value={form[name]} onChange={updateField} placeholder={placeholder} required /></label>
  return <form className="form-card" onSubmit={nextStep}><div className="form-card-heading"><div><p className="eyebrow">STEP 01 / 02</p><h2>Student profile</h2></div><span className="required-note">* Required fields</span></div><div className="field-grid">
    <label className="field span-2"><span>Student name *</span><input name="studentName" value={form.studentName} onChange={updateField} placeholder="Enter full name" required /></label>
    <label className="field"><span>Gender *</span><select name="gender" value={form.gender} onChange={updateField} required><option value="">Select gender</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select></label>
    {input('rollNo', 'Roll number', 'text', 'e.g. CSE2024018')}{input('dob', 'Date of birth', 'date')}
    <label className="field"><span>Blood group *</span><select name="bloodGroup" value={form.bloodGroup} onChange={updateField} required><option value="">Select group</option>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((group) => <option key={group}>{group}</option>)}</select></label>
    {input('phone', 'Phone number', 'tel', '+91 00000 00000')}{input('email', 'Email ID', 'email', 'you@example.com')}
    <label className="field span-2"><span>Address *</span><textarea name="address" value={form.address} onChange={updateField} placeholder="House number, street, city" required /></label>
  </div><div className="section-divider"><span>Academic details</span></div><div className="field-grid academic-grid">
    <label className="field"><span>Department *</span><select name="department" value={form.department} onChange={updateField} required><option value="">Select department</option>{Object.keys(courses).map((department) => <option key={department}>{department}</option>)}</select></label>
    <label className="field span-2"><span>Department of engineering course *</span><select name="course" value={form.course} onChange={updateField} required disabled={!form.department}><option value="">{form.department ? 'Select course' : 'Select department first'}</option>{(courses[form.department] || []).map((course) => <option key={course}>{course}</option>)}</select></label>
    <label className="field"><span>Year *</span><select name="year" value={form.year} onChange={updateField} required><option value="">Select year</option><option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option></select></label>
    <label className="field"><span>Section *</span><select name="section" value={form.section} onChange={updateField} required><option value="">Select section</option><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
    <label className="field"><span>Number of backlogs *</span><input type="number" min="0" name="backlogs" value={form.backlogs} onChange={updateField} placeholder="0" required /><small className="field-hint">Only students with 0 backlogs can continue.</small></label>
  </div><div className="form-actions"><span className={form.backlogs && form.backlogs !== '0' ? 'warning-message' : 'helper-message'}>{form.backlogs && form.backlogs !== '0' ? 'You need zero backlogs to continue.' : 'You can edit your profile before submitting.'}</span><button className="primary-button" type="submit" disabled={form.backlogs !== '0'}>Continue to preferences <span>→</span></button></div></form>
}

function Preferences({ selected, toggleCompany, setStep, submit, submitError }) {
  return <form className="form-card preference-card" onSubmit={submit}><div className="form-card-heading"><div><p className="eyebrow">STEP 02 / 02</p><h2>Company preferences</h2><p className="card-description">Choose exactly four companies you would like to be considered for.</p></div><span className="selection-badge">{selected.length} / 4 selected</span></div><div className="company-choice-grid">{companies.map((company) => <button className={selected.includes(company) ? 'company-choice selected' : 'company-choice'} type="button" key={company} onClick={() => toggleCompany(company)}><span className="choice-icon">{company.charAt(0)}</span><span>{company}</span><i>{selected.includes(company) ? '✓' : '+'}</i></button>)}</div>{submitError && <p className="warning-message">{submitError}</p>}<div className="form-actions preference-actions"><button className="back-button" type="button" onClick={() => setStep(1)}>← Back to profile</button><button className="primary-button" type="submit" disabled={selected.length !== 4}>Submit registration <span>→</span></button></div></form>
}

function Admin({ registrations, count, setView }) {
  return <section className="page admin-page"><div className="page-heading"><div><p className="eyebrow">PLACEMENT OFFICE / OVERVIEW</p><h1>Registration intelligence</h1><p className="intro">Track eligible students and their preferred companies in one place.</p></div><button className="outline-button" type="button" onClick={() => setView('register')}>+ New registration</button></div><div className="stats-grid"><div className="stat-card"><span>Total registrations</span><strong>{registrations.length}</strong><small>Active applications</small></div><div className="stat-card"><span>Companies selected</span><strong>{registrations.length * 4}</strong><small>Across all preferences</small></div><div className="stat-card"><span>Eligible students</span><strong>{registrations.filter((item) => item.backlogs === '0').length}</strong><small>Zero backlog status</small></div></div><div className="admin-content"><section className="company-panel"><div className="panel-heading"><div><p className="eyebrow">PREFERENCE BREAKDOWN</p><h2>Company-wise registrations</h2></div><span className="live-pill"><i /> Live</span></div><div className="company-list">{companies.map((company, index) => <div className="company-row" key={company}><span className="company-rank">{String(index + 1).padStart(2, '0')}</span><strong>{company}</strong><div className="bar-track"><span style={{ width: `${Math.max(count(company) * 24, 4)}%` }} /></div><b>{count(company)}</b></div>)}</div></section><section className="recent-panel"><div className="panel-heading"><div><p className="eyebrow">LATEST ENTRY</p><h2>Recent students</h2></div></div>{registrations.slice(-4).reverse().map((student) => <div className="student-row" key={`${student.rollNo}-${student.studentName}`}><span className="avatar">{student.studentName.charAt(0)}</span><div><strong>{student.studentName}</strong><small>{student.rollNo} · {student.department}</small></div><span className="selection-count">{student.companies.length}/4</span></div>)}</section></div></section>
}

export default App
