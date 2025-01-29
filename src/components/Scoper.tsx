export default function Scoper({ style }: { style: string }) {
  return (
    <style>
      {`@scope {
      :scope {
        ${style}
      }
      }
      `}
    </style>
  );
}
