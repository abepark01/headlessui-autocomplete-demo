"use client"
import { useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronsUpDown, Loader2 } from 'lucide-react';
import { Person } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';


export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');

  const { data: filteredPeople, isLoading } = useQuery({
    queryKey: ['people', query],
    queryFn: async () => {
      const res = await fetch(`/api/person?q=${query}`)
      return res.json();
    }
  });

  const items = filteredPeople || [];

  function handleSelect(person: Person) {
    setSelectedPerson(person)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <Label htmlFor="person-search">Person</Label>
          <div className="relative">
            <Combobox value={selectedPerson} onChange={handleSelect}>
              <ComboboxInput
                id="person-search"
                className={'w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 '}
                aria-label="Assignee"
                onBlur={() => setQuery('')}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
              <div className="flex items-center space-x-2 flex-wrap">

              </div>
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </ComboboxButton>
              <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {!isLoading && items.length === 0 && (
                  <div
                    className="data-[focus]:bg-indigo-600 group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:text-white"
                  >
                    There are no results.
                  </div>
                )}
                {items.length > 0 && items.map((person: Person) => (
                  <ComboboxOption
                    value={person}
                    key={person.id}
                    className="data-[focus]:bg-indigo-600 group relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 data-[focus]:text-white"
                  >
                    <span className="block truncate group-data-[selected]:font-semibold">
                      {person.name}
                    </span>
                    <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-indigo-600 group-data-[selected]:flex group-data-[focus]:text-white">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            </Combobox>
          </div>

        </div>
      </main>
    </div>
  );
}
