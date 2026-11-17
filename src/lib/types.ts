export type AppRole =
  | "INSTITUTION"
  | "PARTNER"
  | "VERIFIER"
  | "STUDENT"
  | "SUPER_ADMIN";

export type DemoUser = {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: AppRole;
  tenantId?: string;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-institution",
    email: "registrar@unilag.edu.ng",
    password: "demo1234",
    fullName: "Dr. A. Adeleke",
    role: "INSTITUTION",
    tenantId: "11111111-1111-1111-1111-111111111111",
  },
  {
    id: "demo-partner",
    email: "ops@edusoft.ng",
    password: "demo1234",
    fullName: "Tunde Partner",
    role: "PARTNER",
    tenantId: "22222222-2222-2222-2222-222222222222",
  },
  {
    id: "demo-verifier",
    email: "consular@wes.org",
    password: "demo1234",
    fullName: "Embassy Desk Officer",
    role: "VERIFIER",
  },
  {
    id: "demo-student",
    email: "babatunde@student.unilag.edu.ng",
    password: "demo1234",
    fullName: "Babatunde Adeleke Emmanuel",
    role: "STUDENT",
    tenantId: "11111111-1111-1111-1111-111111111111",
  },
  {
    id: "demo-admin",
    email: "root@legitscan.ng",
    password: "demo1234",
    fullName: "Platform Operator",
    role: "SUPER_ADMIN",
    tenantId: "33333333-3333-3333-3333-333333333333",
  },
];

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: AppRole;
  tenantId?: string | null;
  mode: "demo" | "supabase";
};
