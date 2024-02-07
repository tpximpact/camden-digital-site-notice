import { defineField, defineType } from "sanity";

export default defineType({
    title: "Global Content",
    name: "global-content",
    type: "document",
    fields: [
        defineField({
            title: "Concern Url",
            name: "concernUrl",
            type: "string",
          }),
          defineField({
            title: "Concern Content",
            name: "concernContent",
            type: "text",
          }),
          defineField({
            name: 'feedbackUrl',
            title: 'Feedback Url',
            type: 'string',
          }),
          defineField({
            name: 'councilName',
            title: 'Council Name',
            type: 'string',
            validation: Rule => Rule.required(),
          }),
          defineField({
            name: 'SignUpUrl',
            title: 'Sign Up Url',
            type: 'string',
          }),
          defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
          }),
    ],
    
});