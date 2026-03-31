type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-sm text-zinc-500">{eyebrow}</p> : null}
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
