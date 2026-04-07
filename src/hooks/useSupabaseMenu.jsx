import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('category_order', { ascending: true, nullsFirst: true });
      
    if (catError) console.error("Error fetching categories:", catError);
    else setCategories(catData || []);

    const { data: itemData, error: itemError } = await supabase
      .from('menu_items')
      .select('*')
      .order('item_order', { ascending: true, nullsFirst: true });
      
    if (itemError) console.error("Error fetching items:", itemError);
    else setMenuItems(itemData || []);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MenuContext.Provider value={{ categories, menuItems, loading, refetch: fetchData }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useSupabaseMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useSupabaseMenu must be used within a MenuProvider');
  }
  return context;
}
