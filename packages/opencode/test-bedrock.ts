import { streamText, tool, jsonSchema } from "ai"
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock"
import fs from "fs"

async function run() {
  const logContent = fs.readFileSync("/Users/ansarisam/accure/accure-code/packages/opencode/bedrock_debug.log", "utf8")
  // Find all JSON blocks in the log
  const blocks = logContent.split(/^---$/gm).map(b => b.trim()).filter(Boolean)
  
  // Find the last block that is a valid JSON request log containing messages
  let requestData: any = null
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i]
    // Strip headers
    const jsonOnly = block.replace(/^\[Bedrock Request Start\]|^EVENT:.*$/gm, "").trim()
    try {
      const parsed = JSON.parse(jsonOnly)
      if (parsed && parsed.messages && parsed.modelId) {
        requestData = parsed
        break
      }
    } catch {}
  }

  if (!requestData) {
    console.error("Could not find any request data in bedrock_debug.log")
    return
  }

  console.log(`Found request data from ts: ${requestData.ts} for model: ${requestData.modelId}`)
  
  const bedrock = createAmazonBedrock({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "mock-key",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "mock-secret",
    name: "some-random-provider",
    extraKey: "ignored-or-not?"
  } as any)

  // Define tools like in repro.test.ts
  const tools: Record<string, any> = {}
  if (requestData.toolNames) {
    for (const name of requestData.toolNames) {
      tools[name] = tool({
        description: `Mock description for ${name}`,
        inputSchema: jsonSchema({
          type: "object",
          properties: {
            command: { type: "string" },
            filePath: { type: "string" },
            content: { type: "string" },
            query: { type: "string" },
          }
        }),
        execute: async () => "mock result"
      })
    }
  }

  try {
    const result = await streamText({
      model: bedrock(requestData.modelId),
      messages: requestData.messages,
      system: requestData.system,
      tools,
      temperature: requestData.temperature ?? 0,
      maxOutputTokens: requestData.maxOutputTokens ?? 5000,
    })

    console.log("Streaming response:")
    let chunkCount = 0
    
    // We listen to the full stream to see all events
    for await (const part of result.fullStream) {
      chunkCount++
      console.log(`Event #${chunkCount}:`, JSON.stringify(part))
    }

    console.log("Stream finished.")
  } catch (err: any) {
    console.error("Error occurred:", err.name, "-", err.message)
    if (err.cause) {
      console.error("Cause:", err.cause)
    }
  }
}

run()
