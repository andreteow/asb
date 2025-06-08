# Malaysia's Impact Ecosystem Directory

You open a single website and instantly see what every Malaysian social enterprise, investor and ecosystem builder is up to right now. That’s the vibe we’re going for with ASBhive.

We grab useful info that’s already floating around the internet (think company pages, news stories, LinkedIn posts) and pull it into one clean map. Anything the AI miss, humans can add by hand. The data stays fresh in real-time, and anyone can search or filter to find potential partners, cool projects or funding leads. Bottom line: more visibility, less guesswork and a tighter, friendlier startup scene.


## Features

- **Automated Profile Generation**: Add organizations by simply providing their website URL
- **AI-Powered Data Extraction**: Utilizes web scraping and AI to automatically extract organization information
- **Bulk Upload Support**: Import multiple organizations via CSV/Excel files
- **Profile Management**: Edit and update organization profiles
- **Interactive UI**: Modern, responsive interface built with Next.js and Tailwind CSS

## How we’ll make the magic happen

- **Frontend**: Next.js plus React, polished with Tailwind and shadcn/ui for snappy, modern screens
- **UI Components**: 
  - Tailwind CSS for styling
  - Shadcn UI components
  - Lucide icons
  - TurndownService to flip messy HTML into tidy Markdown
- **API Integration**: Axios for HTTP requests
- **Backend**: Flask API for web scraping (separate repository)
- **Database**: Supabase keeps everything organised and easy to query, 
- **AI sidekick**: 
    - Grok AI pulls in trending news so you never miss a headline 
    - Google's Gemini AI for extracting and summarizing website content

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn
- Python 3.7+ (for scraping API)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/andreteow/asb
cd asb
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Start the scraping API server (in a separate terminal):
```bash
cd scraping-api
python app.py
```

The application will be available at `https://v0-image-analysis-rho-seven-62.vercel.app/`

## Project Structure

```
asb/
├── app/
│   ├── add/
│   │   └── page.tsx          # Add/Edit organization page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── toast.tsx
│   ├── add-entity-form.tsx   # Organization form component
│   └── upload-csv-form.tsx   # CSV upload component
├── lib/
│   └── data.ts              # Data fetching utilities
├── public/
│   └── assets/              # Static assets
├── styles/                  # Additional styles
├── types/                   # TypeScript type definitions
├── .env                     # Environment variables
├── .gitignore
├── next.config.js          # Next.js configuration
├── package.json
├── README.md
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Usage

1. **Adding an Organization**:
   - Navigate to the "Add Profile" page
   - Enter the organization's website URL
   - Review and edit the automatically extracted information
   - Submit the profile

2. **Bulk Upload**:
   - Switch to the CSV tab
   - Upload a properly formatted CSV file
   - Review the imported data

3. **Editing Profiles**:
   - Access existing profiles via the directory
   - Click "Edit" to modify information
   - Save changes

## API Integration

The application integrates with a Flask-based scraping API:

- Endpoint: `https://asbhive-api.onrender.com/scrape`
- Method: POST
- Request Body: `{ "url": "website-url" }`
- Response: Organization data in JSON format

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Quick takeaways
- One stop map for Malaysia’s social-enterprise universe
- Real-time updates from both web scraping and manual entries
- Search and filters so users find exactly who or what they need
- Friendly tech stack that’s fast to ship and easy to scale