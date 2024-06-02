# build stage
FROM node:lts-alpine as build-stage
ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm run build

# production stage
FROM node:lts-alpine as production-stage
ENV NODE_ENV production
COPY --from=build-stage /app/package*.json ./
COPY --from=build-stage /app/node_modules/ ./node_modules/
COPY --from=build-stage /app/dist/ ./dist/
EXPOSE 3006
CMD ["yarn","start"]