export interface User {
  id: number;
  avatar: string,
  fullName: string,
  roleId: number,
  status: string
  username: string,
  isSuperAdmin: boolean,
  casinoId: number,
  isActive : boolean,
  companyName?: string;
  companyAddress?: string;
  taxCode?: string;
  gad?: string;
  password?: string;
  balance?: number;
  bonus?: number;
  casinoCode: string;
}