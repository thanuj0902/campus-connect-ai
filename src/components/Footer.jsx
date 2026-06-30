export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <span className="w-7 h-7 gradient-accent rounded-lg flex items-center justify-center text-white text-xs font-bold">
              C
            </span>
            <span className="gradient-text">CampusConnect AI</span>
          </div>
          <p className="text-text-muted text-sm">
            &copy; {new Date().getFullYear()} CampusConnect AI &mdash; Built for engineering students
          </p>
        </div>
      </div>
    </footer>
  )
}
