import { defineField, defineType } from "sanity";

export default defineType({
  title: "Planning application",
  name: "planning-application",
  type: "document",
  initialValue: {
    proposedLandUse: {
      classB: false,
      classC: false,
      classE: false,
      classF: false,
      suiGeneris: false
    }
  },
  fields: [
    defineField({
      title: "Application number",
      name: "applicationNumber",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      title: "Address",
      name: "development_address",
      type: "string",
      readOnly: true,
    }),
    defineField({
      title: "Application Type",
      name: "application_type",
      type: "string",
    }),
    defineField({
      title: "Application Stage",
      name: "applicationStage",
      type: "string",
    }),
    defineField({
      title: "Name of development",
      name: "name",
      type: "string",
    }),
    defineField({
      title: "Description",
      name: "development_description",
      type: "string",
    }),
    defineField({
      title: "Massings image",
      name: "massings",
      type: "image",
    }),
    defineField({
      title: "Image",
      name: "image",
      type: "image",
    }),
    defineField({
      title: "Height",
      name: "height",
      type: "number",
    }),
    defineField({
      title: "Development Type",
      name: "developmentType",
      type: "string",
    }),
    defineField({
      title: 'Estimated construction time',
      name: 'constructionTime',
      type: 'string'
    }),
    defineField({
      title: 'Proposed land use',
      description: 'Select all land use classes that apply',
      name: 'proposedLandUse',
      type: 'object',
      fields: [
        {
          title: 'Class B - Industrial',
          name: 'classB',
          type: 'boolean',
          options: {
            layout: 'checkbox'
          }
        },
        {
          title: 'Class C - Residential',
          name: 'classC',
          type: 'boolean',
          options: {
            layout: 'checkbox'
          }
        },
        {
          title: 'Class E - Commercial',
          name: 'classE',
          type: 'boolean',
          options: {
            layout: 'checkbox'
          }
        },
        {
          title: 'Class F - Community',
          name: 'classF',
          type: 'boolean',
          options: {
            layout: 'checkbox'
          }
        },
        {
          title: 'SG - Sui Generis',
          name: 'suiGeneris',
          type: 'boolean',
          options: {
            layout: 'checkbox'
          }
        },
        {
          title: 'SG - Sui Generis Detail',
          description: 'Please specify the use class for Sui Generis',
          name: 'suiGenerisDetail',
          type: 'string',
          hidden: ({document}: any) => !document?.proposedLandUse.suiGeneris,
          validation: Rule => Rule.custom(({field, context}: any) => (context.document.proposedLandUse.suiGeneris && field === undefined) ? "This field must not be empty." : true),
        }
      ]
    }),
    defineField({
      title: "Comment Deadline",
      name: "commentDeadline",
      type: "string",
    }),
    {
      title: 'Housing',
      name: 'housing',
      type: 'object',
      hidden: ({document}) => !document?.showHousing,
      fields: [
        {
          title: 'New residential homes',
          name: 'residentialUnits',
          type: 'number',
        },
        {
          title: 'Affordable residential homes',
          name: 'affordableResidentialUnits',
          type: 'number'
        },
      ]
    },
    {
      title: 'Open space area in square metres',
      name: 'openSpaceArea',
      type: 'number',
      hidden: ({document}) => !document?.showOpenSpace,
      validation: Rule => Rule.custom(({field, context}: any) => (context.document.showOpenSpace && field === undefined) ? "This field must not be empty if the open space impact option is selected" : true),
    },

    {
      title: 'Additional healthcare demand',
      description: 'As a percentage',
      name: 'healthcareDemand',
      type: 'number',
      hidden: ({document}) => !document?.showHealthcare,
      validation: Rule => Rule.custom(({field, context}: any) => (context.document.showHealthcare && field === undefined) ? "This field must not be empty if the healthcare impact option is selected" : true),
    },

    defineField({
      title: 'Housing impact',
      name: 'showHousing',
      type: 'boolean'
    }),
    {
      title: 'Carbon impact',
      name: 'showCarbon',
      type: 'boolean'
    },
    {
      title: 'Percentage change in CO2 emissions',
      name: 'carbonEmissions',
      type: 'number',
      hidden: ({document}) => !document?.showCarbon,
      validation: Rule => Rule.custom(({field, context}: any) => (context.document.showCarbon && field === undefined) ? "This field must not be empty if the carbon impact option is selected" : true),
    },
    defineField({
      title: "Air Quality",
      name: "airQuality",
      type: "string",
    }),
    defineField({
      title: "Eastings",
      name: "eastings",
      type: "string",
      readOnly: true,
    }),
    defineField({
      title: "Northings",
      name: "northings",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: 'isActive',
      title: 'IsActive',
      type: 'boolean',
      initialValue: true
    }),

    {
      title: 'Pedestrian and vehicle access',
      name: 'showAccess',
      type: 'boolean'
    },
    {
      title: 'Pedestrian and vehicle access',
      name: 'access',
      type: 'text',
      hidden: ({document}) => !document?.showAccess,
      validation: Rule => Rule.custom(({field, context}: any) => (context.document.showAccess && field === undefined) ? "This field must not be empty if the pedestrian and vehicle access impact option is selected" : true),
    },

    {
      title: 'Jobs impact',
      name: 'showJobs',
      type: 'boolean'
    },
    {
      title: 'New jobs',
      name: 'jobs',
      type: 'object',
      hidden: ({document}) => !document?.showJobs,
      fields: [
        {
          title: 'Minimum',
          name: 'min',
          type: 'number'
        },
        {
          title: 'Maximum',
          name: 'max',
          type: 'number'
        }
      ]
    },
    
    defineField({
      name: 'commments',
      title: 'Comments',
      type: 'array',
      of: [
        {
          type: 'comment'
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'reference',
      subtitle: 'name'
    }
  }
});

