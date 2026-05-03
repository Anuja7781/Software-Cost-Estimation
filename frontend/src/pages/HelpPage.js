import React from 'react';
import './HelpPage.css';
import './HelpPage.css';

const HelpPage = ({ onBack }) => {
  const costFactors = [
    {
      category: "Core Project Features",
      factors: [
        {
          name: "Equivalent Physical KLOC",
          description: "Lines of code in thousands (KLOC). The strongest cost driver - larger codebases require exponentially more effort.",
          impact: "Increases cost significantly",
          example: "100 KLOC project costs much more than 10 KLOC project"
        },
        {
          name: "Project Year",
          description: "Year the project was/will be developed. Accounts for technological progress and productivity improvements.",
          impact: "Generally decreases cost over time",
          example: "2024 projects cost less than 1990 projects due to better tools"
        }
      ]
    },
    {
      category: "Development Mode",
      factors: [
        {
          name: "Embedded Mode",
          description: "Software that is part of a larger system (embedded in hardware, real-time systems).",
          impact: "Increases cost by 20-50%",
          example: "Embedded systems need more complex integration and testing"
        }
      ]
    },
    {
      category: "Product Characteristics",
      factors: [
        {
          name: "Reliability Requirements",
          description: "Required software reliability level - how critical system failures are.",
          impact: "Very High reliability can double development effort",
          example: "Medical or aviation software needs very high reliability"
        },
        {
          name: "Database Size",
          description: "Size/complexity of database components.",
          impact: "High database size increases effort by 20-30%",
          example: "Large enterprise databases require more design effort"
        },
        {
          name: "Product Complexity",
          description: "Overall complexity of the software product.",
          impact: "Very High complexity can increase effort by 50%+",
          example: "AI systems or complex algorithms are very high complexity"
        },
        {
          name: "Time Constraint",
          description: "Schedule pressure and time constraints.",
          impact: "Very High time pressure can increase effort by 30-40%",
          example: "6-month deadline vs 2-year deadline significantly increases cost"
        }
      ]
    },
    {
      category: "Team Experience & Capability",
      factors: [
        {
          name: "Storage Constraint",
          description: "High memory/storage limitations requiring optimization.",
          impact: "Increases cost",
          example: "Mobile apps with limited memory need special optimization"
        },
        {
          name: "Virtual Machine Experience",
          description: "Team experience with development environments/VMs.",
          impact: "Decreases cost",
          example: "Experienced teams work more efficiently"
        },
        {
          name: "Turnaround Time",
          description: "High requirements for quick response times.",
          impact: "Increases cost",
          example: "Real-time systems need performance optimization"
        },
        {
          name: "Analyst Capability",
          description: "Skills and experience of systems analysts.",
          impact: "Very High capability can reduce effort by 20-30%",
          example: "Expert analysts produce better requirements faster"
        },
        {
          name: "Applications Experience",
          description: "Team experience with similar applications.",
          impact: "Decreases cost",
          example: "Domain knowledge reduces learning curve"
        },
        {
          name: "Programmer Capability",
          description: "Skills and experience of programmers.",
          impact: "Very High capability can reduce effort by 25-40%",
          example: "Expert programmers are much more productive"
        }
      ]
    },
    {
      category: "Virtual Machine & Language Experience",
      factors: [
        {
          name: "Virtual Machine Experience",
          description: "Experience with development environments/VMs.",
          impact: "Decreases cost",
          example: "Familiarity with tools improves productivity"
        },
        {
          name: "Language Experience",
          description: "Team familiarity with programming languages used.",
          impact: "High experience can reduce effort by 15-25%",
          example: "Expertise in required languages speeds development"
        }
      ]
    },
    {
      category: "Development Practices & Tools",
      factors: [
        {
          name: "Modern Programming Practices",
          description: "Use of modern development methodologies.",
          impact: "Very High practices can reduce effort by 20-30%",
          example: "Agile, TDD, code reviews improve quality and speed"
        },
        {
          name: "Use of Software Tools",
          description: "Quality and extent of development tools used.",
          impact: "High tool usage can reduce effort by 15-25%",
          example: "IDEs, debuggers, version control save significant time"
        },
        {
          name: "Required Development Schedule",
          description: "Schedule compression requirements.",
          impact: "High schedule pressure can increase effort by 20-40%",
          example: "Compressed schedules require more resources"
        }
      ]
    },
    {
      category: "Modern Development Practices",
      factors: [
        {
          name: "Agile Methodology",
          description: "Using Agile development approaches (Scrum, Kanban, etc.).",
          impact: "Generally decreases cost through better planning",
          example: "Agile reduces waste and improves adaptability"
        },
        {
          name: "CI/CD Pipeline",
          description: "Continuous Integration/Continuous Deployment automation.",
          impact: "Decreases cost through automation",
          example: "Automated testing and deployment reduces manual effort"
        },
        {
          name: "Test Automation",
          description: "Automated testing frameworks and practices.",
          impact: "Decreases cost through faster feedback",
          example: "Automated tests catch bugs early and reduce manual testing"
        },
        {
          name: "Cloud-Native Development",
          description: "Built for cloud deployment with microservices, containers.",
          impact: "Can decrease long-term costs",
          example: "Cloud-native apps are more scalable and maintainable"
        },
        {
          name: "Heavy Open Source Usage",
          description: "Extensive use of open source libraries and frameworks.",
          impact: "Generally decreases cost",
          example: "Leveraging existing solutions reduces development time"
        },
        {
          name: "Microservices Architecture",
          description: "Breaking down application into small, independent services.",
          impact: "Can increase initial cost but decrease long-term maintenance",
          example: "Microservices improve scalability but add complexity"
        }
      ]
    }
  ];

  return (
    <div className="help-page">
      <div className="help-header">
        <h1>Cost Estimation Guide</h1>
        <p>Understanding how different factors affect your software development costs</p>
        <button className="back-button" onClick={onBack}>
          ← Back to Estimation
        </button>
      </div>

      <div className="help-content">
        <div className="help-intro">
          <h2>How Cost Estimation Works</h2>
          <p>
            This tool uses the COCOMO (COnstructive COst MOdel) methodology combined with machine learning
            to predict software development effort in person-months. The model was trained on historical NASA
            and industrial projects to learn the relationships between project characteristics and actual costs.
          </p>
          <div className="cost-drivers">
            <div className="cost-driver">
              <h3> Cost-Increasing Factors</h3>
              <p>Large size, high complexity, tight schedules, inexperienced teams</p>
            </div>
            <div className="cost-driver">
              <h3>Cost-Reducing Factors</h3>
              <p>Experienced teams, modern practices, good tools, familiar technologies</p>
            </div>
          </div>
        </div>

        {costFactors.map((category, categoryIndex) => (
          <div key={categoryIndex} className="help-category">
            <h2>{category.category}</h2>
            <div className="factors-grid">
              {category.factors.map((factor, factorIndex) => (
                <div key={factorIndex} className="factor-card">
                  <h3>{factor.name}</h3>
                  <p className="factor-description">{factor.description}</p>
                  <div className="factor-impact">
                    <strong>Impact: </strong>
                    <span className={`impact-${factor.impact.includes('Increases') ? 'increase' : factor.impact.includes('Decreases') ? 'decrease' : 'mixed'}`}>
                      {factor.impact}
                    </span>
                  </div>
                  <div className="factor-example">
                    <strong>Example: </strong>
                    <span>{factor.example}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="help-footer">
          <h2>Getting Started</h2>
          <ol>
            <li><strong>Fill in project basics:</strong> Size (KLOC) and year</li>
            <li><strong>Describe your product:</strong> Complexity, reliability, constraints</li>
            <li><strong>Assess your team:</strong> Experience levels and capabilities</li>
            <li><strong>Modern practices:</strong> Check relevant methodologies and tools</li>
            <li><strong>Get estimate:</strong> Click "Get Cost Estimate" for prediction</li>
            <li><strong>Understand results:</strong> Use "Get Explanation" to see factor impacts</li>
          </ol>

          <div className="help-note">
            <h3> Pro Tip</h3>
            <p>
              Start with conservative estimates (higher complexity, lower experience) if you're unsure.
              It's better to overestimate than underestimate project costs!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;