import { cn } from "@/lib/utils";

interface Props {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const Button = ({ onClick, className, disabled = false }: Props) => {
  return (
    <button
      onClick={() => onClick()}
      className={cn(
        "no-underline group cursor-pointer relative  text-xs font-semibold leading-6  text-white inline-block",
        className
      )}
      disabled={disabled}
    >
      <div className="relative flex space-x-2 items-center z-10   py-0.5   ">
        <span>{`Next`}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="group-hover:translate-x-1 transform transition ease-in duration-100 "
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.75 8.75L14.25 12L10.75 15.25"
          ></path>
        </svg>
      </div>
    </button>
  );
};

export default Button;
