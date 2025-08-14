# 🔍 Repository Explorer

A modern, responsive web application built with **Next.js** that allows users to search for GitHub users and explore their repositories in a beautiful, intuitive interface.

![Repository Explorer](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Material UI](https://img.shields.io/badge/Material_UI-007FFF?style=for-the-badge&logo=mui)

## ✨ Features

### 🚀 **Smart Search**

-   **Debounced search** with 500ms delay for optimal performance
-   **Auto-search** as you type (minimum 3 characters)
-   **Manual search** with Enter key or search button
-   **Real-time feedback** during search operations

### 📊 **User Profile Display**

-   **Comprehensive user information** including avatar, bio, location
-   **GitHub statistics** (repositories, followers, following)
-   **Social links** (blog, company, email)
-   **Join date** and account details
-   **Responsive card design** with beautiful gradients

### 📁 **Repository Showcase**

-   **Grid layout** of user repositories
-   **Repository statistics** (stars, forks, language)
-   **Live demo links** when available
-   **Repository descriptions** and metadata
-   **Direct links** to GitHub repositories
-   **Privacy indicators** (public/private)

### 🎨 **Enhanced User Experience**

-   **Loading states** with spinners and progress indicators
-   **Error handling** with specific error messages (404, rate limits, network issues)
-   **Responsive design** for all screen sizes
-   **Beautiful animations** and hover effects
-   **Toast notifications** for user feedback
-   **Clear/reset functionality**

## 🛠️ Technologies Used

-   **Frontend Framework**: Next.js 14+ (App Router)
-   **UI Library**: React 18+
-   **Styling**: Tailwind CSS
-   **Components**: Material-UI (MUI)
-   **Icons**: React Icons (Font Awesome)
-   **HTTP Client**: Axios
-   **Notifications**: React-Toastify
-   **API**: GitHub REST API v3

## 📦 Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Abhinav0115/repo-explorer.git
    cd github-repo-explorer
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🚀 Usage

1. **Search for a user**: Enter a GitHub username in the search bar
2. **Auto-search**: Start typing and the app will search automatically after 3+ characters
3. **View profile**: See comprehensive user information and statistics
4. **Explore repositories**: Browse through the user's repositories with detailed information
5. **Visit links**: Click on repository links, live demos, or social links

## 📁 Project Structure

```
repo-explorer/
├── src/
│   ├── app/
│   │   ├── page.js          # Main application page
│   │   ├── layout.js        # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Repo.js          # Repository grid component
│   │   ├── userCard.js      # User profile card component
│   │   └── RepoFilters.js   # Repository filters (if needed)
│   └── layout/
│       └── Header.js        # Header component (if needed)
├── public/
│   ├── favicon.ico
│   └── ...
├── tailwind.config.js       # Tailwind CSS configuration
├── package.json
└── README.md
```

## 🎯 Key Components

### **Main Page (`src/app/page.js`)**

-   Handles search functionality with debouncing
-   Manages loading and error states
-   Orchestrates user and repository data display

### **UserCard Component (`src/components/userCard.js`)**

-   Displays user profile information
-   Shows GitHub statistics
-   Responsive design with beautiful styling

### **Repo Component (`src/components/Repo.js`)**

-   Renders repository grid
-   Handles repository data fetching
-   Shows repository statistics and metadata

## 🌟 Features in Detail

### Debounced Search

-   Reduces API calls by waiting 500ms after user stops typing
-   Improves performance and respects GitHub API rate limits
-   Provides smooth user experience

### Responsive Design

-   Mobile-first approach
-   Tablet and desktop optimized
-   Flexible grid layouts
-   Touch-friendly interactions

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS for styling. Configuration can be found in `tailwind.config.js`.

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy with default settings

### Deploy on Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Configure redirects if needed

## 📈 Performance Optimizations

-   **Debounced API calls** to reduce server load
-   **Image optimization** with Next.js Image component
-   **Code splitting** with Next.js App Router
-   **Lazy loading** for better initial page load
-   **Error boundaries** for graceful error handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhinav Anand**

-   GitHub: [@Abhinav0115](https://github.com/Abhinav0115)
-   Portfolio: [Your Portfolio URL]

## 🙏 Acknowledgments

-   [GitHub API](https://docs.github.com/en/rest) for providing the data
-   [Next.js](https://nextjs.org/) for the amazing React framework
-   [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
-   [Material-UI](https://mui.com/) for the React components
-   [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icons

---

⭐ **Star this repository if you found it helpful!**
