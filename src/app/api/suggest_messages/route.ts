import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(request: Request){
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro"});
    const Categories: string[]  = [
        "Technology", "Science", "Health", "Education", "Finance", "Sports",
        "Entertainment", "Travel", "Food", "Fashion", "Art", "Music",
        "Literature", "History", "Politics", "Environment", "Economics",
        "Religion", "Philosophy", "Psychology", "Sociology", "Anthropology",
        "Linguistics", "Law", "Medicine", "Astronomy", "Biology", "Chemistry",
        "Physics", "Mathematics", "Engineering", "Architecture", "Design",
        "Robotics", "Artificial Intelligence", "Machine Learning", "Data Science",
        "Statistics", "Marketing", "Advertising", "E-commerce", "Real Estate",
        "Investing", "Personal Finance", "Cryptocurrency", "Blockchain",
        "Gaming", "Movies", "Television", "Theater", "Dance", "Comedy",
        "Photography", "Videography", "Podcasts", "Social Media", "Blogging",
        "Writing", "Journalism", "Public Relations", "Human Resources",
        "Leadership", "Management", "Productivity", "Self-Improvement",
        "Fitness", "Wellness", "Nutrition", "Mental Health", "Parenting",
        "Relationships", "Lifestyle", "Travel", "Adventure", "Automotive",
        "Aviation", "Boating", "Motorcycles", "Public Transportation",
        "Space Exploration", "Hiking", "Camping", "Fishing", "Hunting",
        "Gardening", "Home Improvement", "DIY", "Crafts", "Collectibles",
        "Antiques", "Pets", "Animals", "Wildlife", "Conservation", "Volunteering",
        "Charity", "Nonprofit", "Activism", "Human Rights", "Peace", "Conflict Resolution",
        "Culture", "Traditions", "Customs"
    ]
    
    const topic = Categories[Math.floor(Math.random()*Categories.length)]
    let prompt = `reate a list of four open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. Pick a random topic and give the questions on that particular topic only. include questions related to ${topic}.`
       try {
        const result = await model.generateContent(prompt);
        const response = result.response.text()
        const suggessions = response.split('||')
        return Response.json(
            {
            success: true,
            suggessions,
        },
        { status: 200 }
    )
    } catch (error) {
        console.log('Error creating suggessions: ', error)
        return Response.json(
            {
            success: true,
            message: 'Error creating suggessions',
        },
        { status: 200 }
    )
    }
}
