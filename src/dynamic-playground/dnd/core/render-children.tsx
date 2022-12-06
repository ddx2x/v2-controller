import { FR } from '.';

export const RenderChildren: React.FC<any> = ({ children, preview }) => {
  return (
    <>
      {children.map((child: any, i: { toString: () => any }) => {
        const FRProps = {
          id: child,
          preview,
        };
        return <FR key={i.toString()} {...FRProps} />;
      })}
    </>
  );
};
