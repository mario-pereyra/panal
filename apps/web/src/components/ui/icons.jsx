export const STROKE_PROPS = {
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinejoin: "round",
  strokeLinecap: "round",
};

export function PlusIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      {...STROKE_PROPS}
      strokeWidth="3"
      {...props}
    >
      <path d="M12 5 v14 M5 12 h14" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      {...STROKE_PROPS}
      strokeWidth="2.8"
      {...props}
    >
      <path d="M5 12.5 l4.5 5 l9.5 -11" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      {...STROKE_PROPS}
      strokeWidth="2.6"
      {...props}
    >
      <path d="M6 6 l12 12 M18 6 l-12 12" />
    </svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      {...STROKE_PROPS}
      strokeWidth="2.4"
      {...props}
    >
      <path d="M9 6 l6 6 l-6 6" />
    </svg>
  );
}

export function MoreIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="18.5" cy="12" r="2" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16 l4.5 4.5" />
    </svg>
  );
}

export function ShareIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M12 3 V15 M7 8 l5 -5 l5 5" />
      <path d="M5 12 V18.5 A2.5 2.5 0 0 0 7.5 21 H16.5 A2.5 2.5 0 0 0 19 18.5 V12" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <rect x="8" y="8" width="12" height="12" rx="2.5" />
      <path d="M16 8 V6.5 A2.5 2.5 0 0 0 13.5 4 H6.5 A2.5 2.5 0 0 0 4 6.5 V13.5 A2.5 2.5 0 0 0 6.5 16 H8" />
    </svg>
  );
}

export function TrashIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M4 7 h16 M9 7 V4.5 A1.5 1.5 0 0 1 10.5 3 h3 A1.5 1.5 0 0 1 15 4.5 V7" />
      <path d="M6.5 7 l1 12.5 A2 2 0 0 0 9.5 21 h5 a2 2 0 0 0 2 -1.5 L17.5 7" />
    </svg>
  );
}

export function ArchiveIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <rect x="3" y="4" width="18" height="4" rx="1.5" />
      <path d="M5 8 v10.5 A2.5 2.5 0 0 0 7.5 21 h9 A2.5 2.5 0 0 0 19 18.5 V8" />
      <path d="M10 12.5 h4" />
    </svg>
  );
}

export function EditIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M16.5 3.5 a2.1 2.1 0 0 1 3 3 L8 18 l-4 1 l1 -4 Z" />
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      {...STROKE_PROPS}
      strokeWidth="2.4"
      {...props}
    >
      <path d="M19 12 H5 M11 6 l-6 6 l6 6" />
    </svg>
  );
}

export function SparklesIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M12 3 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" />
      <path d="M19 16 v4 M17 18 h4" />
    </svg>
  );
}

export function UsersIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 19.5 c0 -3.2 2.7 -5.5 6 -5.5 s6 2.3 6 5.5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14.5 c2.5 0.3 4.5 2 4.5 4.5" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3 v4 M16 3 v4 M3.5 10 h17" />
    </svg>
  );
}

export function AlertIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8 v5 M12 16.5 h0.01" />
    </svg>
  );
}

export function EyeIcon({ crossed = false, ...props }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M2.5 12 C5 7 8.5 5 12 5 C15.5 5 19 7 21.5 12 C19 17 15.5 19 12 19 C8.5 19 5 17 2.5 12 Z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <path d="M4 20 L20 4" />}
    </svg>
  );
}

export function OfflineIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" {...STROKE_PROPS} {...props}>
      <path d="M7 18 H17.5 A4 4 0 0 0 18 10 A6 6 0 0 0 6.6 9 A4.5 4.5 0 0 0 7 18 Z" />
      <path d="M4 4 L20 20" />
    </svg>
  );
}
