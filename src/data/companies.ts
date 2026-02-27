export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  description: string;
  logo: string;
}

export const companies: Company[] = [
  {
    id: "c1",
    name: "NovaTech Solutions",
    industry: "Technology",
    location: "Lilongwe, Mw",
    description: "A leading software company specializing in cloud infrastructure and enterprise solutions.",
    logo: "NT",
  },
  {
    id: "c2",
    name: "GreenLeaf Health",
    industry: "Healthcare",
    location: "Kasungu, Mw",
    description: "Innovative healthcare technology company transforming patient care through digital solutions.",
    logo: "GL",
  },
  {
    id: "c3",
    name: "FinEdge Capital",
    industry: "Finance",
    location: "Lilongwe, Mw",
    description: "Modern fintech firm providing next-generation banking and investment platforms.",
    logo: "FE",
  },
  {
    id: "c4",
    name: "BuildRight Construction",
    industry: "Construction",
    location: "Mangochi, Mw",
    description: "Sustainable construction and architecture firm focused on smart building technologies.",
    logo: "BR",
  },
  {
    id: "c5",
    name: "DataStream Analytics",
    industry: "Technology",
    location: "Blantyre, Mw",
    description: "Big data and analytics company helping businesses unlock insights from their data.",
    logo: "DS",
  },
];
