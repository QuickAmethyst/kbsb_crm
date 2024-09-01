import theme from "@/utils/theme"
import { PropsWithChildren } from "react"

export type DefaultTemplateProps = PropsWithChildren

export default function DefaultTemplate({
  children
}: DefaultTemplateProps) {
  return (
    <div>
      <header></header>

      <main>
        {children}
      </main>

      <style jsx>
        {`
          header {
            width: 100%;
            height: 60px;
            background-color: ${theme.color.grey[1]};
            box-shadow: 0px 5px 5px rgba(0,0,0,.15);
          }
        `}
      </style>
    </div>
  )
}