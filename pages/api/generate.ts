// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'

// const configuration = new Configuration({
//     apiKey: '',
// })
// const openai = new OpenAIApi(configuration)

export default async function handler(req: any, res: any) {
    const { prompt } = req.body

    const payload = {
        model: 'text-davinci-003',
        prompt:
            'In the next sentence I will give you the description of a person or a pet friend first check if it is really the description for a person or a pet friend and then give me the best 9 ideas for a gift to give the person or pet friend, if it was not the description of a person or a pet friend do not do anything, the ideas must be diversified.' +
            prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 300,
        n: 1,
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
        },
        method: 'POST',
        body: JSON.stringify(payload),
    })

    const json = await response.json()
    res.status(200).json(json)
}
