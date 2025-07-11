import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, Brain, Target, CheckCircle, AlertCircle, TrendingUp, Users, Award } from 'lucide-react';

/**
 * Assessment Engine - Academic Level Evaluator
 * Project: K-12 Lesson Plan App
 * Path: lesson-plan-app/src/components/assessment/
 * Dependencies: React 18+, lucide-react, TypeScript
 * 
 * Features:
 * - Academic level assessment (not age-based)
 * - Bloom's Taxonomy integration
 * - Multi-domain evaluation
 * - Adaptive question selection
 * - Accessibility-first design
 * - Privacy-compliant data handling
 */

// Types for assessment system
interface Student {
  id: string;
  name: string;
  academicLevel: number;
  domains: Record<string, number>;
  lastAssessment: Date;
}

interface AssessmentDomain {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  bloomsLevels: string[];
  competencies: string[];
  color: string;
}

interface AssessmentQuestion {
  id: string;
  domain: string;
  bloomsLevel: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
}

interface AssessmentResult {
  studentId: string;
  domain: string;
  score: number;
  bloomsLevel: number;
  recommendations: string[];
  nextSteps: string[];
}

// Assessment domains configuration
const ASSESSMENT_DOMAINS: AssessmentDomain[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Target,
    bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    competencies: ['Number Sense', 'Algebra', 'Geometry', 'Statistics', 'Problem Solving'],
    color: 'bg-blue-500'
  },
  {
    id: 'reading',
    name: 'Reading & Literature',
    icon: BookOpen,
    bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    competencies: ['Phonics', 'Fluency', 'Comprehension', 'Critical Analysis', 'Creative Writing'],
    color: 'bg-green-500'
  },
  {
    id: 'science',
    name: 'Science',
    icon: Brain,
    bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    competencies: ['Scientific Method', 'Life Science', 'Physical Science', 'Earth Science', 'Engineering'],
    color: 'bg-purple-500'
  },
  {
    id: 'arts',
    name: 'Performing Arts',
    icon: Award,
    bloomsLevels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    competencies: ['Music Theory', 'Visual Arts', 'Drama', 'Dance', 'Creative Expression'],
    color: 'bg-pink-500'
  }
];

// Sample assessment questions (in real app, these would come from a database)
const SAMPLE_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'math_001',
    domain: 'mathematics',
    bloomsLevel: 2,
    question: 'If Sarah has 15 apples and gives 4 to her friend, how many apples does she have left?',
    options: ['11', '19', '9', '12'],
    correctAnswer: 0,
    explanation: 'Subtraction: 15 - 4 = 11 apples remaining',
    difficulty: 1
  },
  {
    id: 'reading_001',
    domain: 'reading',
    bloomsLevel: 3,
    question: 'Based on the story, what can you infer about the character\'s motivation?',
    options: ['They are hungry', 'They want to help others', 'They are angry', 'They are confused'],
    correctAnswer: 1,
    explanation: 'The character\'s actions throughout the story show a pattern of helping behavior',
    difficulty: 2
  }
];

const AssessmentEngine: React.FC = () => {
  // State management
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  // Sample student data (in real app, this would come from secure database)
  const [students] = useState<Student[]>([
    {
      id: 'student_001',
      name: 'Alex Johnson',
      academicLevel: 3,
      domains: { mathematics: 2, reading: 4, science: 3, arts: 2 },
      lastAssessment: new Date('2024-01-15')
    },
    {
      id: 'student_002',
      name: 'Maya Patel',
      academicLevel: 4,
      domains: { mathematics: 5, reading: 3, science: 4, arts: 5 },
      lastAssessment: new Date('2024-01-10')
    }
  ]);

  // Adaptive question selection based on student performance
  const selectAdaptiveQuestion = useCallback((domain: string, studentLevel: number): AssessmentQuestion | null => {
    const domainQuestions = SAMPLE_QUESTIONS.filter(q => q.domain === domain);
    
    if (domainQuestions.length === 0) return null;
    
    // Select question based on student's current level ± 1 for optimal challenge
    const targetDifficulty = Math.max(1, Math.min(5, studentLevel));
    const suitableQuestions = domainQuestions.filter(q => 
      Math.abs(q.difficulty - targetDifficulty) <= 1
    );
    
    return suitableQuestions[Math.floor(Math.random() * suitableQuestions.length)] || domainQuestions[0];
  }, []);

  // Start assessment for selected student and domain
  const startAssessment = useCallback((studentId: string, domain: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setCurrentStudent(student);
    setSelectedDomain(domain);
    setIsAssessing(true);
    setAssessmentProgress(0);
    
    const question = selectAdaptiveQuestion(domain, student.domains[domain] || 1);
    setCurrentQuestion(question);
  }, [students, selectAdaptiveQuestion]);

  // Process assessment answer
  const processAnswer = useCallback((selectedAnswer: number) => {
    if (!currentQuestion || !currentStudent) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newProgress = Math.min(100, assessmentProgress + 25);
    setAssessmentProgress(newProgress);

    // Generate assessment result
    const result: AssessmentResult = {
      studentId: currentStudent.id,
      domain: selectedDomain,
      score: isCorrect ? 100 : 0,
      bloomsLevel: currentQuestion.bloomsLevel,
      recommendations: isCorrect 
        ? ['Continue with similar complexity questions', 'Try advanced problems']
        : ['Review fundamental concepts', 'Practice similar problems'],
      nextSteps: isCorrect 
        ? ['Progress to next level', 'Explore related topics']
        : ['Reinforce basics', 'Provide additional support']
    };

    setAssessmentResults(prev => [...prev, result]);

    // Continue assessment or finish
    if (newProgress >= 100) {
      setIsAssessing(false);
      setCurrentQuestion(null);
    } else {
      // Get next adaptive question
      const nextQuestion = selectAdaptiveQuestion(selectedDomain, currentStudent.domains[selectedDomain] || 1);
      setCurrentQuestion(nextQuestion);
    }
  }, [currentQuestion, currentStudent, selectedDomain, assessmentProgress, selectAdaptiveQuestion]);

  // Calculate academic level based on assessment results
  const calculateAcademicLevel = useCallback((results: AssessmentResult[]): number => {
    if (results.length === 0) return 1;
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const avgBloomsLevel = results.reduce((sum, r) => sum + r.bloomsLevel, 0) / results.length;
    
    return Math.ceil((avgScore / 100) * avgBloomsLevel);
  }, []);

  // Generate learning recommendations
  const generateRecommendations = useCallback((student: Student, domain: string): string[] => {
    const currentLevel = student.domains[domain] || 1;
    const domainData = ASSESSMENT_DOMAINS.find(d => d.id === domain);
    
    if (!domainData) return [];
    
    const recommendations = [];
    
    if (currentLevel < 3) {
      recommendations.push(`Focus on ${domainData.bloomsLevels[0]} and ${domainData.bloomsLevels[1]} skills`);
      recommendations.push('Use visual aids and hands-on activities');
      recommendations.push('Provide frequent positive reinforcement');
    } else if (currentLevel < 5) {
      recommendations.push(`Develop ${domainData.bloomsLevels[2]} and ${domainData.bloomsLevels[3]} skills`);
      recommendations.push('Introduce problem-solving strategies');
      recommendations.push('Encourage peer collaboration');
    } else {
      recommendations.push(`Challenge with ${domainData.bloomsLevels[4]} and ${domainData.bloomsLevels[5]} tasks`);
      recommendations.push('Provide independent research opportunities');
      recommendations.push('Encourage creative expression');
    }
    
    return recommendations;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Academic Level Assessment System
          </h1>
          <p className="text-gray-600">
            Evaluate student progress based on academic competency, not age
          </p>
        </div>

        {/* Student Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2" />
            Select Student
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <div 
                key={student.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  currentStudent?.id === student.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setCurrentStudent(student)}
                role="button"
                tabIndex={0}
                aria-label={`Select student ${student.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setCurrentStudent(student);
                  }
                }}
              >
                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                <p className="text-sm text-gray-600">
                  Academic Level: {student.academicLevel}
                </p>
                <p className="text-xs text-gray-500">
                  Last Assessment: {student.lastAssessment.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Domain Selection */}
        {currentStudent && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Assessment Domains for {currentStudent.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ASSESSMENT_DOMAINS.map(domain => {
                const Icon = domain.icon;
                const currentLevel = currentStudent.domains[domain.id] || 1;
                
                return (
                  <div
                    key={domain.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedDomain === domain.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => !isAssessing && startAssessment(currentStudent.id, domain.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Start assessment for ${domain.name}`}
                    onKeyDown={(e) => {
                      if (!isAssessing && (e.key === 'Enter' || e.key === ' ')) {
                        startAssessment(currentStudent.id, domain.id);
                      }
                    }}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-full ${domain.color} text-white mr-3`}>
                        <Icon size={20} />
                      </div>
                      <h3 className="font-semibold text-gray-800">{domain.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Current Level: {currentLevel}
                    </p>
                    <p className="text-xs text-gray-500">
                      Bloom's Level: {domain.bloomsLevels[Math.min(currentLevel - 1, 5)]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Assessment Interface */}
        {isAssessing && currentQuestion && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  Assessment in Progress
                </h2>
                <span className="text-sm text-gray-600">
                  {assessmentProgress}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${assessmentProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Question (Bloom's Level: {currentQuestion.bloomsLevel})
              </h3>
              <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
              
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full p-3 text-left rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    onClick={() => processAnswer(index)}
                    aria-label={`Option ${index + 1}: ${option}`}
                  >
                    <span className="font-medium text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assessment Results */}
        {assessmentResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              Assessment Results
            </h2>
            
            {assessmentResults.map((result, index) => {
              const domain = ASSESSMENT_DOMAINS.find(d => d.id === result.domain);
              const Icon = domain?.icon || CheckCircle;
              
              return (
                <div key={index} className="border-l-4 border-blue-500 pl-4 mb-4">
                  <div className="flex items-center mb-2">
                    <Icon className="mr-2 text-blue-500" size={20} />
                    <h3 className="font-semibold text-gray-800">
                      {domain?.name} Assessment
                    </h3>
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                      result.score >= 80 ? 'bg-green-100 text-green-800' :
                      result.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.score}%
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Bloom's Taxonomy Level: {result.bloomsLevel}
                  </p>
                  
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-700 mb-1">Recommendations:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start">
                          <CheckCircle className="mr-2 mt-0.5 text-green-500 flex-shrink-0" size={12} />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Next Steps:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.nextSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start">
                          <AlertCircle className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" size={12} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Learning Recommendations */}
        {currentStudent && selectedDomain && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Brain className="mr-2" />
              Learning Recommendations
            </h2>
            
            <div className="space-y-3">
              {generateRecommendations(currentStudent, selectedDomain).map((recommendation, index) => (
                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="mr-3 mt-0.5 text-green-500 flex-shrink-0" size={16} />
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentEngine;