import { generateObject } from 'ai'
import { z } from 'zod'

const FormulationSchema = z.object({
  colorName: z.string().describe('The name of the paint color'),
  productType: z.string().describe('The type of paint product, e.g., QD Enamel'),
  baseSize: z.number().describe('The total size/volume of the formulation'),
  baseUnit: z.string().default('litre').describe('The unit of measurement'),
  description: z.string().optional().describe('Any additional notes or description'),
  components: z.array(
    z.object({
      name: z.string().describe('The name of the component/ingredient'),
      quantity: z.number().describe('The quantity of this component'),
      unit: z.string().default('litre').describe('The unit for this component'),
    })
  ).describe('List of all components in the formulation'),
})

export async function POST(request: Request) {
  try {
    const { image } = await request.json()
    
    if (!image) {
      return Response.json({ error: 'No image provided' }, { status: 400 })
    }

    // Use AI SDK to analyze the image and extract formulation data
    const { object } = await generateObject({
      model: 'openai/gpt-4o',
      schema: FormulationSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image of a paint formulation recipe. Extract all the information including:
- Color name
- Product type (e.g., QD Enamel, DTM, etc.)
- Total size/volume
- All components with their quantities and units

If any information is unclear or missing, make reasonable assumptions based on common paint formulation practices. Pay special attention to handwritten text.`,
            },
            {
              type: 'image',
              image,
            },
          ],
        },
      ],
    })

    return Response.json({ data: object })
  } catch (error) {
    console.error('[v0] Error extracting formulation:', error)
    return Response.json(
      { error: 'Failed to extract formulation from image' },
      { status: 500 }
    )
  }
}
