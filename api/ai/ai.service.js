import axios from 'axios'
import { adjustBoard } from './util.js'
import { API_KEY } from '../../config.js'

export const aiService = {
    generateBoardFromDescription,
}
const BASE_URL = 'https://api.openai.com/v1/completions'
export async function generateBoardFromDescription(description) {
    const prompt = `
    Generate a detailed single board structure in an accurate JSON format for the following project description: "${description}". 
    Only return the JSON object, nothing else. 
    Example JSON:
    {
        "title": "Example",
        "description": "An example project board generated by AI.",
        "groups": [
            {
                "title": "Some group title...", //note that you always write the title
                "style": {"backgroundColor": "rgb(255, 90, 196)"},
                "tasks": [
                    {
                        "title": "some task title...",
                        "description": "some description about how to do the task"
                    }
                ]
            }
        ]
    }`

    try {
        const response = await axios.post(
            BASE_URL,
            {
                model: 'gpt-3.5-turbo-instruct',
                prompt: prompt,
                max_tokens: 1500,
                temperature: 0.7,
                n: 1,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        )

        const answer = response.data.choices[0].text.trim()
        const board = JSON.parse(answer)

        return adjustBoard(board)
    } catch (error) {
        console.error('Error fetching AI generated board:', error.response ? error.response.data : error.message)
        throw error
    }
}