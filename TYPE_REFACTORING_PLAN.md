# TypeScript Type Refactoring Plan

## Overview
This document outlines the plan to refactor TypeScript types from a single centralized file (`src/shared/types.ts`) to a more organized, maintainable structure that follows best practices: centralizing shared domain types while localizing component-specific types.

## Current State Analysis

### Issues Identified
1. **Duplicate `CartItem` type**:
   - `src/shared/types.ts`: `{ item: Item, quantity: number, subTotal: number }`
   - `src/api/User.ts`: `{ item: Item, quantity: number }` (missing `subTotal`)
   
2. **Types that should be centralized**:
   - `Item`, `CartItem`, `Review`, `Recipe`, `Tokens` - Used across 10+ modules ✅
   
3. **Types that could be localized**:
   - `PersonalInfo` - Used in 3 modules (Personalinfo, Planner, API) - Keep centralized
   - `UserPageInfo` - Used in 2 modules (UserPage, API) - Keep centralized
   - `ProfileInfo` - Used in 2 modules (Profile, API) - Keep centralized
   - `DayMeal` - Only in Planner component - Should be localized ✅
   - `mealDurations` enum - Only in Planner component - Should be localized ✅

4. **Types that are already local** (good):
   - Component props interfaces (e.g., `ProfileReadModeProps`)
   - Internal implementation types (e.g., `UnparsedItemType` in `SoilInfo.ts`)

## Target Structure

```
src/
├── types/                    # NEW: Centralized types
│   ├── index.ts             # Main export (re-exports all)
│   ├── domain.ts            # Domain models (Item, CartItem, Review, Recipe)
│   ├── user.ts              # User-related types (ProfileInfo, UserPageInfo, PersonalInfo)
│   └── common.ts            # Common utilities (Tokens)
│
├── api/
│   └── types.ts             # NEW: API-specific types (if needed)
│
└── components/
    ├── Profile/
    │   └── types.ts         # NEW: Profile-specific types (if any)
    └── Planner/
        └── types.ts         # NEW: Move DayMeal here
```

## Migration Phases

### Phase 1: Analysis and Preparation ✅

#### Step 1.1: Type Usage Analysis
- ✅ **PersonalInfo**: Used in `Personalinfo`, `Planner`, and `api/User.ts` (3 modules) → **Keep centralized**
- ✅ **UserPageInfo**: Used in `UserPage` and `api/User.ts` (2 modules) → **Keep centralized** (API usage suggests it's a domain type)
- ✅ **ProfileInfo**: Used in `Profile` components and `api/User.ts` (2 modules) → **Keep centralized**
- ✅ **CartItem**: **DUPLICATE** - Must fix!
  - `shared/types.ts`: `{ item: Item, quantity: number, subTotal: number }`
  - `api/User.ts`: `{ item: Item, quantity: number }` (missing subTotal)
- ✅ **CartItemType**: Legacy type in `Items.ts`, extends `Item` → Review and potentially remove
- ✅ **UserCode**: Only in `api/User.ts` → **Keep local**
- ✅ **DayMeal**: Only in `Planner` → **Move to component**
- ✅ Component props: Already local → **Keep local**

---

### Phase 2: Create New Structure

#### Step 2.1: Create Organized Type Directories
1. Create `src/types/` directory
2. Create `src/types/domain.ts` - Domain models
3. Create `src/types/user.ts` - User-related types
4. Create `src/types/common.ts` - Common utilities
5. Create `src/types/index.ts` - Main export
6. Create `src/components/Planner/types.ts` - Component-specific types

---

### Phase 3: Migration Steps

#### Step 3.1: Create New Type Files

**File: `src/types/domain.ts` (NEW)**
```typescript
// Domain models - used across multiple modules

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export interface Item {
    id: number;
    title: string;
    price: number;
    tags: string[];
    discount: number;
    desc: string;
    reviewRating: number;
    reviewCount: number;
    isSpecial: boolean;
    imgUrl?: string;
}

export interface CartItem {
    item: Item;
    quantity: number;
    subTotal: number;  // Keep this version (from shared/types.ts)
}

export interface Review {
    id: number;
    userId: number;
    userName: string;
    dateCreated: string;
    isDeleted: boolean;
    isFlagged: boolean;
    itemId: number;
    rating: number;
    reviewTxt: string;
}

export type UserReview = Review;

export interface Recipe {
    id: number;
    name: string;
    description?: string;
    imgUrl?: string;
    [key: string]: unknown;
}
```

**File: `src/types/user.ts` (NEW)**
```typescript
// User-related types

import { UserReview } from './domain';

export interface PersonalInfo {
    sex: "male" | "female";
    age: number;
    weight: number;
    weightGoal: number;
    weightGainPerWeek: number;
    height: number;
    bodyFatPerc: number;
    activityLevel: string;
    dietaryPreference: string;
    healthGoal: string;
}

export interface UserPageInfo {
    userId: number;
    name: string;
    reviews: UserReview[];
    [key: string]: unknown;
}

export interface ProfileInfo {
    name: string;
    email: string;
    dateJoined: string;
    [key: string]: unknown;
}
```

**File: `src/types/common.ts` (NEW)**
```typescript
// Common utility types

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};
```

**File: `src/types/index.ts` (NEW)**
```typescript
// Central export for all types
export * from './domain';
export * from './user';
export * from './common';
```

**File: `src/components/Planner/types.ts` (NEW)**
```typescript
import { Recipe } from '@/types';

export type DayMeal = {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
};

export enum mealDurations {
    daily = 1,
    weekly = 7,
}
```

#### Step 3.2: Fix Duplicate CartItem

1. **Remove** `CartItem` from `api/User.ts` (lines 10-13)
2. **Import** `CartItem` from `@/types` instead
3. **Update** API functions to use the centralized type

**Before:**
```typescript
// src/api/User.ts
export type CartItem = {
    item: Item;
    quantity: number;
};
```

**After:**
```typescript
// src/api/User.ts
import { CartItem } from '@/types';
// Remove the duplicate definition
```

#### Step 3.3: Update Imports (In Order)

**Priority Order:**
1. Update `src/shared/types.ts`:
   - Remove all type definitions
   - Re-export from `@/types` for backward compatibility (temporary)

2. Update API files:
   - `src/api/User.ts`: Import from `@/types`
   - `src/api/Item.ts`: Import from `@/types`

3. Update components:
   - `src/components/Personalinfo/Personalinfo.tsx`
   - `src/components/Planner/Planner.tsx`
   - `src/components/UserPage/UserPage.tsx`
   - `src/components/Profile/*.tsx`
   - All other components using types

4. Update other files:
   - `src/App.tsx`
   - `src/SoilInfo.ts`
   - `src/Items.ts` (review `CartItemType` usage)

**Import Pattern:**
```typescript
// Before
import { Item, CartItem, PersonalInfo } from "@shared/types";

// After
import { Item, CartItem, PersonalInfo } from "@/types";
```

#### Step 3.4: Clean Up Legacy Types

1. **Review `CartItemType` in `Items.ts`**:
   - Check if still used
   - If not used → Remove
   - If used → Decide: migrate to `CartItem` or keep as legacy type

2. **Remove temporary re-exports** from `shared/types.ts` after migration complete

---

### Phase 4: Detailed File Changes

#### Files to Create

1. **`src/types/domain.ts`** - Domain models
2. **`src/types/user.ts`** - User-related types  
3. **`src/types/common.ts`** - Common utilities
4. **`src/types/index.ts`** - Main export
5. **`src/components/Planner/types.ts`** - Planner-specific types

#### Files to Modify

**High Priority:**
- `src/api/User.ts` - Remove duplicate `CartItem`, update imports
- `src/shared/types.ts` - Temporary re-exports, then remove

**Medium Priority (Update Imports):**
- `src/api/Item.ts`
- `src/api/index.ts`
- `src/App.tsx`
- `src/SoilInfo.ts`
- `src/Items.ts`

**Component Files (Update Imports):**
- `src/components/Personalinfo/Personalinfo.tsx`
- `src/components/Personalinfo/NumInput.tsx`
- `src/components/Personalinfo/DD.tsx`
- `src/components/Planner/Planner.tsx`
- `src/components/Planner/MealDisplay.tsx`
- `src/components/UserPage/UserPage.tsx`
- `src/components/UserPage/UserReviews.tsx`
- `src/components/Profile/Profile.tsx`
- `src/components/Profile/ProfileReadMode.tsx`
- `src/components/Profile/ProfileEditMode.tsx`
- `src/components/Profile/ProfileChangePswd.tsx`
- `src/components/ItemPage/ItemPage.tsx`
- `src/components/ItemPage/InfoContainer.tsx`
- `src/components/ItemPage/ReviewDiv.tsx`
- `src/components/ItemPage/ReviewForm.tsx`
- `src/components/ItemPage/ReviewDisplay.tsx`
- `src/components/Shop/Shop.tsx`
- `src/components/ShoppingCart/DataGridComponent.tsx`
- `src/components/ShoppingCart/CartTotalCard.tsx`
- `src/components/ShoppingCart/Checkout/PaymentDetails.tsx`
- `src/components/Home/Specials.tsx`
- `src/shared/ItemCard/ItemCard.tsx`
- `src/shared/ItemCard/Btns.tsx`

**Test Files:**
- `tests/ShoppingCart.test.tsx`
- `tests/DataGridComponent.test.tsx`

---

### Phase 5: Execution Order

1. ✅ **Create new type files** (`types/domain.ts`, `types/user.ts`, `types/common.ts`, `types/index.ts`)
2. ✅ **Create component-specific types** (`components/Planner/types.ts`)
3. ✅ **Fix duplicate `CartItem`** in `api/User.ts`
4. ✅ **Update `shared/types.ts`** to re-export (temporary backward compatibility)
5. ✅ **Update all imports** to use `@/types` or component-specific paths
6. ✅ **Test compilation** - Ensure TypeScript compiles without errors
7. ✅ **Remove `shared/types.ts` re-exports** - Clean up temporary code
8. ✅ **Delete or repurpose `shared/types.ts`** - Keep empty for future shared types if needed

---

### Phase 6: Verification Checklist

- [ ] No duplicate type definitions
- [ ] All imports updated to use new paths
- [ ] TypeScript compiles without errors
- [ ] No runtime errors
- [ ] `CartItem` has consistent structure everywhere (with `subTotal`)
- [ ] Component-specific types are co-located with components
- [ ] Domain types are centralized in `types/` directory
- [ ] Legacy types removed or documented
- [ ] All test files updated
- [ ] No unused imports

---

### Phase 7: Optional Improvements

1. **Add JSDoc comments** to types for better IDE support
2. **Consider creating `api/types.ts`** for API-specific types if needed
3. **Add type guards/validators** if runtime type checking is needed
4. **Consider using branded types** for IDs (e.g., `type UserId = number & { __brand: 'UserId' }`)
5. **Add type exports** to component `index.ts` files for easier imports

---

## Decision Framework

When deciding where to place a type, ask:

1. **Is it used in 3+ different modules?** → Centralize in `types/`
2. **Is it a domain model** (Item, User, Cart)? → Centralize in `types/domain.ts`
3. **Is it only used in one component/module?** → Localize in component/module
4. **Is it an internal implementation detail?** → Localize in the file that uses it
5. **Is it part of a public API/interface?** → Centralize in `types/`

---

## Benefits of This Approach

✅ **Easier to find**: Shared types in one place, local types nearby  
✅ **Better encapsulation**: Internal types stay internal  
✅ **Reduced coupling**: Components don't import types they don't need  
✅ **Easier refactoring**: Change local types without affecting others  
✅ **Clearer ownership**: Each module owns its types  
✅ **No duplicates**: Single source of truth for each type  
✅ **Better organization**: Logical grouping of related types  

---

## Risk Assessment

- **Risk Level**: Low
- **Breaking Changes**: None (backward compatibility maintained via re-exports)
- **Files Affected**: ~30 files (mostly import updates)
- **Testing Required**: TypeScript compilation, runtime testing
- **Rollback Plan**: Git revert if issues arise

---

## Timeline Estimate

- **Phase 1-2**: 15 minutes (Analysis and structure creation)
- **Phase 3**: 30-45 minutes (File creation and migration)
- **Phase 4**: 30-45 minutes (Import updates)
- **Phase 5-6**: 15-30 minutes (Testing and verification)
- **Total**: ~2 hours

---

## Notes

- Maintain backward compatibility during migration using re-exports
- Test after each phase to catch issues early
- Use TypeScript's type checking to verify correctness
- Consider using a find-and-replace tool for bulk import updates
- Keep `shared/types.ts` temporarily for safety, remove after verification

