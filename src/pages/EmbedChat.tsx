export default function EmbedChat() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe 
        src="https://www.kimi.com/share/19a92a09-9a32-8626-8000-00008fd72752"
        className="w-full h-full border-0"
        title="Embedded Chat History"
        allow="fullscreen"
      />
    </div>
  );
}
