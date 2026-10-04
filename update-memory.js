const fs = require('fs');
let content = fs.readFileSync('app/events/[id]/page.tsx', 'utf8');

if (!content.includes('Loader2')) {
  content = content.replace(/import \{([\s\S]*?)Upload,/, "import {$1Upload,\n  Loader2,");
}

const targetButton = `<button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Submit Memory
                    </button>`;

const newButton = `<button
                      type="submit"
                      disabled={isUploading}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      {isUploading ? 'Uploading...' : 'Submit Memory'}
                    </button>`;

content = content.replace(targetButton, newButton);
fs.writeFileSync('app/events/[id]/page.tsx', content);
