
import { Configuration, OpenAIApi } from "openai";

const port = process.env.PORT || "8080";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
async function getResponse(body) {
  console.log('running...')
  // system prompt engineering
  let delimiter = "####";
  let system_message = `You will get text from dictionary.
  You gimme result in csv formt like the following:
  $, English Word, $, $, English Meaning, $, Arabic Meaning
  replace $ with empty 
  if the word has more that one meaning repeat the word with the other meanings
  don't include the pronunciation representation in the meaning
  `
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role": "system", "content": system_message},
        {"role": "user", "content":body.prompt.replace(/,/g, "")}
    ]
    });
    return  completion;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.log(error.message);
      return null;
    }
  }
}


export default defineEventHandler( async (event) => {
  console.log('running...')
  const body = await readBody(event);
  if(body.prompt.trim().length === 0) return "Please, enter a valid prompt";
  const response = await getResponse(body)
  if(response?.data.choices && response?.data.choices.length > 0) {
    return response.data.choices[0].message
  }
  return "";
});