import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [jobroles, setJobroles] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [userSkills, setUserSkills] = useState([])
  const [inputSkill, setInputSkill] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/roles/')
  .then(res => {
        setJobroles(res.data)
        setSelectedJob(res.data[0]?.name || '')
      })
  }, [])

  const addSkill = () => {
    if(inputSkill &&!userSkills.includes(inputSkill.toLowerCase())){
      setUserSkills([...userSkills, inputSkill.toLowerCase()])
      setInputSkill('')
    }
  }

  const currentJob = jobroles.find(j => j.name === selectedJob)
  const requiredSkills = currentJob? currentJob.skills.map(s => s.name.toLowerCase()) : []
  const missingSkills = requiredSkills.filter(s =>!userSkills.includes(s))
  const matchedSkills = userSkills.filter(s => requiredSkills.includes(s))
  const matchPercent = requiredSkills.length > 0? Math.round((matchedSkills.length / requiredSkills.length) * 100) : 0

  const getMatchColor = () => {
    if(matchPercent > 70) return '#4caf50'
    if(matchPercent > 40) return '#ff9800'
    return '#f44336'
  }

  return (
    <div className="container">

      {/* ADDED THIS HEADER WITH LOGOUT BUTTON */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1>🎯 Skill Gap Analyzer</h1>
        <a
          href="http://127.0.0.1:8000/logout/"
          style={{
            background: 'red',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}>
          Logout
        </a>
      </div>

      <label><b>Select Job Role:</b></label>
      <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
        {jobroles.map(job => <option key={job.id}>{job.name}</option>)}
      </select>

      <div style={{display: 'flex', margin: '20px 0'}}>
        <input
          value={inputSkill}
          onChange={e => setInputSkill(e.target.value)}
          placeholder="Enter a skill you know"
        />
        <button onClick={addSkill}>Add Skill</button>
      </div>

      <div className="skills-box">
        <h3>Your Skills</h3>
        <p>{userSkills.join(', ') || 'None yet. Add some skills above!'}</p>
      </div>

      <div className="match-box" style={{background: getMatchColor() + '22', color: getMatchColor()}}>
        Match: {matchPercent}%
        <div className="progress-bar">
          <div className="progress" style={{width: matchPercent + '%'}}></div>
        </div>
      </div>

      <h3>Missing Skills for {selectedJob}:</h3>
      {missingSkills.length === 0? <p style={{color: 'green'}}>🎉 You have all the skills!</p> :
        missingSkills.map(s => <div key={s} className="missing-skill">❌ {s}</div>)
      }
    </div>
  )
}
export default App