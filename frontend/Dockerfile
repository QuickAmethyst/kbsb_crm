FROM node:20.15-alpine as builder
WORKDIR /project
COPY ./package.json ./package-lock.json .
RUN npm ci
COPY . .
RUN echo NEXT_PUBLIC_APP_ENV=production >> .env; echo NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/query >> .env
RUN npm run build

FROM node:20.15-alpine
WORKDIR /project
COPY --from=builder /project/.next/standalone .
COPY --from=builder /project/.next/static .next/static
COPY --from=builder /project/public public
COPY --from=builder /project/.env .env
RUN chown -R 1000:1000 .
USER node
EXPOSE 3000
CMD node server.js