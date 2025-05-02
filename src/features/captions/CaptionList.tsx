// src/features/caption/CaptionList.tsx

export function CaptionList({ captions }: { captions: string[] }) {
    return (
      <div className="space-y-2 mt-4">
        {captions.map((caption, idx) => (
          <div key={idx} className="border p-3 rounded bg-gray-50">
            {caption}
          </div>
        ))}
      </div>
    );
  }
  