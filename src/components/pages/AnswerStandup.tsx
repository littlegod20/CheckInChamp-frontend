import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getStandupQuestions, submitStandup } from '../../services/api';
import '../styles/answerPage.css';

interface Question {
    _id: string;
    text: string;
}

interface Answer {
    question: string;
    text: string;
    answer: string;
}

const AnswerStandup: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberId = queryParams.get('memberId'); 
    const { teamId } = useParams<{ teamId: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);

    const navigate = useNavigate();

    console.log(memberId);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await getStandupQuestions(teamId as string);
                setQuestions(response.data.questions);
                // Initialize answers with empty strings for each question
                setAnswers(
                    response.data.questions.map((q: Question) => ({
                        question: q._id,
                        text: q.text,
                        answer: '',
                    }))
                );
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [teamId]);

    const handleInputChange = (questionText: string, value: string) => {
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.text === questionText
                    ? { ...answer, answer: value }
                    : answer
            )
        );
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(memberId)
        try {
            const response = await submitStandup(teamId as string, memberId as string, answers);
            if (response.status === 200 || response.status === 201) {
                alert('Standup submitted successfully');
                navigate(`/teams`);
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    return (
        <div className='answer-standup-page'>
            <div className="answer-standup-container">
                <h1>Answer Standup Questions</h1>
                <form className='answer-standup-form' onSubmit={handleSubmit}>
                    {questions.map((question) => (
                        <div key={question._id}>
                            <label>
                                {question.text}
                                <input
                                    placeholder='Enter your answer here...'
                                    type="text"
                                    value={
                                        answers.find((answer) => answer.text === question.text)?.answer || ''
                                    }
                                    onChange={(e) =>
                                        handleInputChange(question.text, e.target.value)
                                    }
                                />
                            </label>
                        </div>
                    ))}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AnswerStandup;
